from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
import os
import socket
import logging
import time
from dask.distributed import Client
import dask.dataframe as dd
import numpy as np
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

###

def get_data(input_file):
    df = dd.read_table(input_file, sep='\t', assume_missing=True, names=['userId', 'movieId', 'rating', 'rating_timestamp'])
    grouped = df.groupby(['userId', 'movieId'])['rating'].mean().compute()
    result = grouped.unstack()
  return result
 
def consolidate_data(df):
    # Group by 'userId' and 'movieId' and calculate the mean of 'rating'
    consolidated_df = df.groupby(['userId', 'movieId'])['rating'].mean().unstack()
    return consolidated_df

def limpia(np1, np2):
    mask = ~np.isnan(np2)
    np1 = np1[mask]
    np2 = np2[mask]

    np1, np2 = np2, np1

    mask = ~np.isnan(np2)
    np1 = np1[mask]
    np2 = np2[mask]

    np1, np2 = np2, np1

    return pd.DataFrame({'A': np1, 'B': np2})

def computeManhattanDistance(ax, bx):
    return np.sum(np.abs(ax - bx))

def computeNearestNeighbor(username, users_df):
    user_data = np.array(users_df.loc[username])
    distances = np.empty((users_df.shape[0],), dtype=float)

    for i, (index, row) in enumerate(users_df.iterrows()):
        if index != username:
            ax = np.array(row)
            bx = np.array(user_data)
            temp = limpia(ax, bx)
            ax = np.array(temp["A"].tolist())
            bx = np.array(temp["B"].tolist())
            distances[i] = computeManhattanDistance(ax, bx)

    sorted_indices = np.argsort(distances)
    sorted_distances = distances[sorted_indices]

    return list(zip(sorted_distances, users_df.index[sorted_indices]))


def recommend(username, users_df):
    nearest_neighbors = computeNearestNeighbor(username, users_df)
    user_data = np.array(users_df.loc[username])
    user_items = np.isnan(user_data)
    recommendations = {}
    for distance, neighbor in nearest_neighbors:
        neighbor_data = np.array(users_df.loc[neighbor])
        neighbor_items = np.isnan(neighbor_data)
        new_items = np.logical_and(neighbor_items, ~user_items)
        for item_index, has_new_item in enumerate(new_items):
            if has_new_item:
                if item_index not in recommendations:
                    recommendations[item_index] = 0
                recommendations[item_index] += neighbor_data[item_index] / (distance + 1)
    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    recommended_items = [item_index for item_index, score in sorted_recommendations]
    return recommended_items
###
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
  
@app.route("/<int:usuario_id>", methods=['GET'])
def get_usuario(usuario_id):
    #redis = get_redis_broker()
    #valor = redis.get('getUsuarioCursos')
    inicio = time.time()
    df=get_data('ratings.dat')
    items = computeNearestNeighbor(1, df)
    fin = time.time()
    return make_response(jsonify({
        'message':'API procesamiento de datos',
        'tiempo': fin-inicio,
        'items': items
    })) 


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
