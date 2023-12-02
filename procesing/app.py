from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
import os
import socket
import logging
import time
from dask.distributed import Client
from dask import dataframe as dd
import pandas as pd

hostname = socket.gethostname()

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') 
db = SQLAlchemy(app)
client = Client()

def get_redis_broker():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        g.redis = Redis(host="redis-collect", port=6379, db=0, socket_timeout=5)
    return g.redis

class CursoUsuario(db.Model):
    __tablename__ = 'curso_usuario'
    curso_usuario_id = db.Column(db.String(20), primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    curso_id = db.Column(db.String(10), nullable=False) 
    puntuacion = db.Column(db.Float, nullable=True)

    def json(self):
        return {'curso_usuario_id': self.curso_usuario_id, 'usuario_id': self.usuario_id, 'curso_id': self.curso_id, 'puntuacion': self.puntuacion }

def dataframe_cursos_usuarios():
    start_time = time.time()
    with app.app_context():
        try:
            cursos_usuarios = CursoUsuario.query.all()

            data_list = [{'userid': curso.usuario_id, 'cursoid': curso.curso_id, 'puntuacion': curso.puntuacion} for curso in cursos_usuarios]
            ddf = dd.from_pandas(pd.DataFrame(data_list), npartitions=2)
            ddf = ddf.categorize(columns=['cursoid'])
            pivot_ddf = ddf.pivot_table(index='userid', columns='cursoid', values='puntuacion')

            pivot_ddf = pivot_ddf.fillna(0)

            pivot_df = pivot_ddf.compute()

            end_time = time.time()
            duration = end_time - start_time
            print(f"La operación tomó {duration} segundos.")

            return pivot_df

        except SQLAlchemyError as e:
            app.logger.error(f"Error al obtener datos de la base de datos: {e}")
            return None

dataframe = dataframe_cursos_usuarios()
print(dataframe.head())

@app.route("/", methods=['POST','GET'])
def hello():
    return make_response(jsonify({'message':'API procesamiento de datos'})) 

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
