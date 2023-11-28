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
import secrets
import string

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
    curso_usuario_id = db.Column(db.String(20), primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    curso_id = db.Column(db.String(10), nullable=False) 
    puntuacion = db.Column(db.Float, nullable=True)

    def json(self):
        return {'curso_usuario_id': self.curso_usuario_id, 'usuario_id': self.usuario_id, 'curso_id': self.curso_id, 'puntuacion': self.puntuacion }

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

# Let's get all CursoUsuario data
@app.route('/curso_usuarios', methods=['GET'])
def get_curso_usuarios():
    try:
        curso_usuarios = CursoUsuario.query.all()
        curso_usuarios_list = [curso_usuario.json() for curso_usuario in curso_usuarios]
        return jsonify({'curso_usuarios': curso_usuarios_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Let's get courses for a specific user
@app.route('/cursos_por_usuario/<int:usuario_id>', methods=['GET'])
def get_cursos_por_usuario(usuario_id):
    try:
        redis = get_redis_broker()
        cursos_usuario = CursoUsuario.query.filter_by(usuario_id=usuario_id).all()

        if not cursos_usuario:
            return jsonify({'message': 'No se encontraron cursos para el usuario especificado'}), 404
            
        cursos_list = [curso_usuario.json() for curso_usuario in cursos_usuario]
        redis.set('getUsuarioCursos', cursos_list)
        return jsonify({'cursos_por_usuario': cursos_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Let's create curso_usuario data
@app.route('/curso_usuarios', methods=['POST'])
def create_curso_usuario():
    try:
        data = request.json
        usuario_id = data.get('usuario_id')
        curso_id = data.get('curso_id')
        puntuacion = data.get('puntuacion')

        # Generate curso_usuario_id with the specified format
        curso_usuario_id = f"cu-{secrets.choice(string.ascii_letters)}{secrets.choice(string.ascii_letters)}{secrets.choice(string.digits)}{secrets.choice(string.digits)}-{secrets.choice(string.ascii_letters)}{secrets.choice(string.digits)}{secrets.choice(string.digits)}"

        nuevo_curso_usuario = CursoUsuario(
            curso_usuario_id=curso_usuario_id,
            usuario_id=usuario_id,
            curso_id=curso_id,
            puntuacion=puntuacion
        )

        db.session.add(nuevo_curso_usuario)
        db.session.commit()

        return jsonify({'message': 'CursoUsuario creado con éxito', 'curso_usuario_id': nuevo_curso_usuario.curso_usuario_id})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Let's load data from curso_usuarios.json / 14K
@app.route('/cargar_datos_curso_usuarios', methods=['GET'])
def cargar_datos_curso_usuarios():
    try:
        with open('cursos_usuarios.json', 'r') as file:
            datos_curso_usuarios = json.load(file)

        for dato in datos_curso_usuarios:
            nuevo_curso_usuario = CursoUsuario(
                curso_usuario_id=dato['curso_usuario_id'],
                usuario_id=dato['usuario_id'],
                curso_id=dato['curso_id'],
                puntuacion=dato['puntuacion']
            )
            db.session.add(nuevo_curso_usuario)

        db.session.commit()

        return jsonify({'message': 'Datos de CursoUsuario cargados exitosamente'})
    except (SQLAlchemyError, FileNotFoundError) as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Let's load data from 1Kcur_usuarios.json
# Esta ruta solo cargara 1000 datos de prueba
@app.route('/cargar_1k_curso_usuarios', methods=['GET'])
def cargar_1k_curso_usuarios():
    try:
        with open('1Kcur_usuarios.json', 'r') as file:
            datos_curso_usuarios = json.load(file)

        for dato in datos_curso_usuarios:
            nuevo_curso_usuario = CursoUsuario(
                curso_usuario_id=dato['curso_usuario_id'],
                usuario_id=dato['usuario_id'],
                curso_id=dato['curso_id'],
                puntuacion=dato['puntuacion']
            )
            db.session.add(nuevo_curso_usuario)

        db.session.commit()

        return jsonify({'message': 'Datos de CursoUsuario cargados exitosamente'})
    except (SQLAlchemyError, FileNotFoundError) as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
