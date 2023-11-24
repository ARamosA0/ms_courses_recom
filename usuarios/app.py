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

# Curso x Usuario
class CursoUsuario(db.Model):
    __tablename__ = 'curso_usuario'
    curso_usuario_id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    curso_id = db.Column(db.Integer, nullable=False)
    puntuacion = db.Column(db.Float, nullable=True)

    def json(self):
        return {'curso_usuario_id': self.curso_usuario_id,'usuario_id': self.usuario_id, 'curso_id': self.curso_id, 'puntuacion': self.puntuacion }

# Usuario
class Usuario(db.Model):
    __tablename__ = 'usuario'
    usuario_id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    apellido = db.Column(db.String(255), nullable=False)
    dni = db.Column(db.Integer, nullable=False, unique=True)
    correo = db.Column(db.String(255), nullable=False, unique=True)

    def json(self):
        return {'usuario_id': self.usuario_id, 'nombre': self.nombre, 'apellido': self.apellido, 'dni': self.dni, 'correo': self.correo}

# Cuenta de Usuario
class UsuarioCuenta(db.Model):
    __tablename__ = 'usuario_cuenta'
    cuenta_id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

    def json(self):
        return {'cuenta_id': self.cuenta_id, 'usuario_id': self.usuario_id, 'username': self.username, 'password': self.password}
    

with app.app_context():
    db.create_all()


def get_redis():
    if not hasattr(g, 'redis'):
        #cambiar el puerto por 6380 para comectarce al otro redis
        g.redis = Redis(host="redis", port=6379, db=0, socket_timeout=5)
    return g.redis

# It's working?
@app.route("/", methods=['POST', 'GET'])
def hello():
    return make_response(jsonify({'message': 'API usuarios!'}), 200)

# Get all users
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    try:
        usuarios = Usuario.query.all()
        usuarios_list = []
        for usuario in usuarios:
            usuarios_list.append(usuario.json())
        return jsonify({'usuarios': usuarios_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Create a new user
@app.route('/usuarios', methods=['POST'])
def create_usuario():
    try:
        data = request.json
        nuevo_usuario = Usuario(nombre=data['nombre'], apellido=data['apellido'], dni=data['dni'], correo=data['correo'])
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({'message': 'Usuario creado con éxito', 'usuario_id': nuevo_usuario.usuario_id})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get all user accounts
@app.route('/usuarios_cuentas', methods=['GET'])
def get_usuarios_cuentas():
    try:
        usuarios_cuentas = UsuarioCuenta.query.all()
        usuarios_cuentas_list = []
        for usuario_cuenta in usuarios_cuentas:
            usuarios_cuentas_list.append(usuario_cuenta.json())
        return jsonify({'usuarios_cuentas': usuarios_cuentas_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Create a new user account
@app.route('/usuarios_cuentas', methods=['POST'])
def create_usuario_cuenta():
    try:
        data = request.json
        nueva_cuenta = UsuarioCuenta(usuario_id=data['usuario_id'], username=data['username'], password=data['password'])
        db.session.add(nueva_cuenta)
        db.session.commit()
        return jsonify({'message': 'Cuenta de usuario creada con éxito', 'cuenta_id': nueva_cuenta.cuenta_id})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Cursos usuarios general
@app.route('/cursos_usuario', methods=['GET'])
def get_cursos_usuario():
    try:
        # Verifica si se proporciona un parámetro de filtro en la solicitud
        usuario_id = request.args.get('usuario_id')
        if usuario_id:
            cursos_usuario = CursoUsuario.query.filter_by(usuario_id=usuario_id).all()
        else:
            cursos_usuario = CursoUsuario.query.all()

        cursos_list = []
        for curso_usuario in cursos_usuario:
            cursos_list.append({
                'curso_usuario_id': curso_usuario.curso_usuario_id,
                'curso_id': curso_usuario.curso_id,
                'usuario_id': curso_usuario.usuario_id,
                'puntuacion': curso_usuario.puntuacion
            })
        return jsonify({'cursos_usuario': cursos_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Traer cursos de un usuario
@app.route('/curso_usuario/<int:usuario_id>', methods=['GET'])
def get_cursos_usuario(usuario_id):
    try:
        cursos_usuario = CursoUsuario.query.filter_by(usuario_id=usuario_id).all()
        cursos_list = []
        for curso_usuario in cursos_usuario:
            cursos_list.append({
                'curso_usuario_id': curso_usuario.curso_usuario_id,
                'curso_id': curso_usuario.curso_id,
                'puntuacion': curso_usuario.puntuacion
            })
        return jsonify({'cursos_usuario': cursos_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Let's create a this...
@app.route('/curso_usuario', methods=['POST'])
def add_usuario_curso():
    try:
        data = request.json
        nuevo_curso_usuario = CursoUsuario(usuario_id=data['usuario_id'], curso_id=data['curso_id'], puntuacion=data['puntuacion'])
        db.session.add(nuevo_curso_usuario)
        db.session.commit()
        return jsonify({'message': 'Usuario añadido al curso con éxito', 'curso_usuario_id': nuevo_curso_usuario.curso_usuario_id})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=82, debug=True, threaded=True)
