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

hostname = socket.gethostname()

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') 
db = SQLAlchemy(app)

def get_redis():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        g.redis = Redis(host="redis", port=6379, db=0, socket_timeout=5)
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

@app.route('/', methods=['GET'])
def test():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'status': 'Conexión lograda'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Datos de curso x usuario
@app.route('/curso_usuarios', methods=['GET'])
def get_curso_usuarios():
    try:
        curso_usuarios = CursoUsuario.query.all()
        curso_usuarios_list = [curso_usuario.json() for curso_usuario in curso_usuarios]
        return jsonify({'curso_usuarios': curso_usuarios_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
