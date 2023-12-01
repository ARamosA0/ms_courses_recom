from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text 
import os
import socket
import random
import json
import logging
import pandas as pd

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

@app.route("/", methods=['POST','GET'])
def hello():
#    redis = get_redis_broker()
#    valor = redis.get('getUsuarioCursos')
    
    return make_response(jsonify({'message':'API procesamiento de datos'})) 

# Modelo de curso
class CursoUsuario(db.Model):
    __tablename__ = 'curso_usuario'
    curso_usuario_id = db.Column(db.String(20), primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    curso_id = db.Column(db.String(10), nullable=False) 
    puntuacion = db.Column(db.Float, nullable=True)

    def json(self):
        return {'curso_usuario_id': self.curso_usuario_id, 'usuario_id': self.usuario_id, 'curso_id': self.curso_id, 'puntuacion': self.puntuacion }
    
# Funcion para crear DataFrame
def get_data_as_dataframe():
    with app.app_context(): 
        try:
            cursos_usuarios = CursoUsuario.query.all()

            data_list = [{'userid': curso.usuario_id, 'cursoid': curso.curso_id} for curso in cursos_usuarios]

            df = pd.DataFrame(data_list)
            #app.logger.info(df.head(5))   # Esto es para probar los datos  
            return df

        except SQLAlchemyError as e:
            app.logger.error(f"Error al obtener datos de la base de datos: {e}")
            return None

get_data_as_dataframe()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
