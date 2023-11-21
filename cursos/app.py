# from flask import Flask, render_template, request, make_response, g
# from redis import Redis
# import os
# import socket
# import random
# import json
# import logging
#
# hostname = socket.gethostname()
#
# app = Flask(__name__)
#
# gunicorn_error_logger = logging.getLogger('gunicorn.error')
# app.logger.handlers.extend(gunicorn_error_logger.handlers)
# app.logger.setLevel(logging.INFO)
#
# def get_redis():
#     if not hasattr(g, 'redis'):
#         #cambiar el puerto por 6380 para comectarce al otro redis
#         g.redis = Redis(host="redis", port=6379, db=0, socket_timeout=5)
#     return g.redis
#
# @app.route("/", methods=['POST','GET'])
# def index():
#   return json.dumps({'name': 'alice',
#                        'email': 'alice@outlook.com'})
#     
#
#
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=81, debug=True, threaded=True)

#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    return jsonify({'message':{'name': 'alice',
                    'email': 'alice@outlook.com'}})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=81, debug=True, threaded=True)
