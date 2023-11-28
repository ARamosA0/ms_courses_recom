from flask import Flask, render_template, request, make_response, g, jsonify
from redis import Redis
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text 
import os
import socket
import json
import logging

# ##### Funciones de KAFKA #####

import confluent_kafka as ck

admin_conf = {
    'bootstrap.servers': 'localhost:29092'  
}

def producer(producer_conf, topic, message):
    producer = ck.Producer(producer_conf)

    def delivery_report(err, msg):
        if err is not None:
            print(f'Error al enviar mensaje: {err}')
        else:
            print(f'Mensaje enviado: {msg.value().decode("utf-8")}')

    producer.produce(topic, value=message, callback=delivery_report())
    producer.flush

def consumer(consumer_conf, topic, message, delivery_report):
    consumer = ck.Consumer(consumer_conf)
    consumer.subscribe([topic])
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f'Error al recibir mensaje: {msg.error()}')
        else:
            print(f'Mensaje recibido: {msg.key().decode("utf-8")}, Valor: {msg.value().decode("utf-8")}')


# ##### Funciones de KAFKA #####


hostname = socket.gethostname()

app = Flask(__name__)
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  # 'postgresql://postgres-cursos:postgres-cursos@db-cursos:5433/postgres-cursos'
db = SQLAlchemy(app)

class Cursos(db.Model):
    __tablename__ = 'cursos'
    curso_id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    costo = db.Column(db.Float, nullable=False)
    horas = db.Column(db.Integer, nullable=False)

    def json(self):
        return {'curso_id': self.curso_id, 'nombre': self.nombre, 'costo': self.costo, 'horas': self.horas}


with app.app_context():
    db.create_all()

def get_redis():
    if not hasattr(g, 'redis'):
        # cambiar el puerto por 6380 para conectarse al otro redis
        g.redis = Redis(host="redis", port=6379, db=0, socket_timeout=5)
    return g.redis



# It's working?
@app.route("/", methods=['POST', 'GET'])
def hello():
    return make_response(jsonify({'message': 'API cursos!'}), 200)

"""
@app.route('/test', methods=['GET'])
def test():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'status': 'ok'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

#Let's get some courses
@app.route('/cursos', methods=['GET'])
def get_cursos():
    try:
        cursos = Cursos.query.all()
        cursos_list = []
        for curso in cursos:
            cursos_list.append({
                'curso_id': curso.curso_id,
                'nombre': curso.nombre,
                'costo': curso.costo,
                'horas': curso.horas
            })
        return jsonify({'cursos': cursos_list})
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
   

# Let's create a course
@app.route('/cursos', methods=['POST'])
def create_curso():
    try:
        data = request.json
        nuevo_curso = Cursos(nombre=data['nombre'], costo=data['costo'], horas=data['horas'])
        db.session.add(nuevo_curso)
        db.session.commit()
        return jsonify({'message': 'Curso creado con éxito', 'curso_id': nuevo_curso.curso_id})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# Subir datos de prueba

@app.route('/cargar_datos_prueba', methods=['GET'])
def cargar_datos_prueba():
    try:
        datos_prueba = [
            {'nombre': 'Curso 1', 'costo': 100.0, 'horas': 20},
            {'nombre': 'Curso 2', 'costo': 150.0, 'horas': 30},
            {'nombre': 'Curso 3', 'costo': 200.0, 'horas': 60},
            {'nombre': 'Curso 4', 'costo': 180.0, 'horas': 50},
            
        ]

        for dato in datos_prueba:
            nuevo_curso = Cursos(nombre=dato['nombre'], costo=dato['costo'], horas=dato['horas'])
            db.session.add(nuevo_curso)

        db.session.commit()
        
        return jsonify({'message': 'Datos de prueba cargados exitosamente'})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=81, debug=True, threaded=True)
