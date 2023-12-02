from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text 
import os
import socket
import logging
import dask.dataframe as dd

hostname = socket.gethostname()

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') 
db = SQLAlchemy(app)

def get_redis_broker():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        g.redis = Redis(host="redis-collect", port=6379, db=0, socket_timeout=5)
    return g.redis


# Modelo de curso
class CursoUsuario(db.Model):
    __tablename__ = 'curso_usuario'
    curso_usuario_id = db.Column(db.String(20), primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    curso_id = db.Column(db.String(10), nullable=False) 
    puntuacion = db.Column(db.Float, nullable=True)

    def json(self):
        return {'curso_usuario_id': self.curso_usuario_id, 'usuario_id': self.usuario_id, 'curso_id': self.curso_id, 'puntuacion': self.puntuacion }
    
def obtener_datos_postgres():
    try:
        resultados = db.session.query(CursoUsuario.usuario_id, CursoUsuario.curso_id, CursoUsuario.puntuacion).all()
        df = dd.from_pandas(resultados, npartitions=1)
        df_pivot = df.pivot_table(index='usuario_id', columns='curso_id', values='puntuacion', aggfunc='mean')

        return df_pivot.compute()

    except SQLAlchemyError as e:
        app.logger.error(f"Error al obtener datos de PostgreSQL: {str(e)}")
        return None

@app.route('/obtener_datos', methods=['GET'])
def obtener_datos():
    df = obtener_datos_postgres()

    if df is not None:
        # Convertir DataFrame a JSON y devolverlo
        json_resultado = df.to_json(orient='index')
        return jsonify(json_resultado)

    return jsonify({'error': 'Error al obtener datos de PostgreSQL'}), 500

df = obtener_datos_postgres()
app.console.info(df.head(5))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
