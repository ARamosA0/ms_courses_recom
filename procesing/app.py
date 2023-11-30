from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
import os
import socket
import random
import json
import logging
import dask.dataframe as dd
import time
import numpy as np
import pandas as pd

hostname = socket.gethostname()

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

def get_redis_broker():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        g.redis = Redis(host="redis-collect", port=6379, db=0, socket_timeout=5)
    return g.redis

###
def get_data(input_file):
  inicio = time.time()
  ratings = dd.read_table(input_file, sep='\t', assume_missing=True, names=['userId', 'movieId', 'rating', 'rating_timestamp'])
  ratings_pandas = ratings.compute()#ratings_pandas = ratings.compute()
  fin = time.time()
  print(fin-inicio)
  print(ratings.head)
  return ratings.head()
 
def consolidate_data(df):
    # Group by 'userId' and 'movieId' and calculate the mean of 'rating'
    consolidated_df = df.groupby(['userId', 'movieId'])['rating'].mean().unstack()
    return consolidated_df


###

@app.route("/", methods=['POST','GET'])
def hello():
    #redis = get_redis_broker()
    #valor = redis.get('getUsuarioCursos')
    df=get_data("ratings.dat")
    #recommended_items = computeNearestNeighbor(1, df)
    #print(recommended_items)
    return make_response(jsonify({'message':'API procesamiento de datos'})) 


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
