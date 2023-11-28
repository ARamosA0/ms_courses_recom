from flask import Flask, render_template, request, make_response, g
from redis import Redis
import os
import socket
import random
import json
import logging

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

@app.route("/", methods=['POST','GET'])
def hello():
    redis = get_redis_broker()
    valor = redis.get('getUsuarioCursos')
    
  return make_response(jsonify({'message':'API procesamiento de datos'})) 


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
