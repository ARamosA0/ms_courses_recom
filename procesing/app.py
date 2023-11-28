from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text 
import os
import socket
import json
import logging

hostname = socket.gethostname()
print(hostname)

app = Flask(__name__)
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  # 'postgresql://postgres-cursos:postgres-cursos@db-cursos:5433/postgres-cursos'
# def get_redis():
#     if not hasattr(g, 'redis'):
#         # cambiar el puerto por 6380 para conectarse al otro redis
#         # Este redis es el broker
#         g.redis = Redis(host="redis-collect", port=6379, db=0, socket_timeout=5)
#     return g.redis


def get_redis_broker():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        # Este redis es el broker
        g.redis = Redis(host='redis-collect', port=6379, db=0, socket_timeout=5)
    return g.redis



# It's working?
@app.route("/", methods=['POST', 'GET'])
def hello():
    redis = get_redis_broker()
    valor = redis.get('getUsuario')
    print(valor)
    app.logger.info(valor)
    return make_response(jsonify({'message': 'API procesing!'}), 200)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=83, debug=True, threaded=True)
