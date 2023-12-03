#!/bin/bash

#CAMBIAR LA IP
IP="192.168.0.18"

# Load Balancer
curl -X POST http://localhost:8001/upstreams --data name=loadbalancer_upstream
sleep 3
curl -X POST http://localhost:8001/upstreams/loadbalancer_upstream/targets --data target='http://$IP:5000'
sleep 3
curl -X POST http://localhost:8001/upstreams/loadbalancer_upstream/targets --data target='http://$IP:5001'
sleep 3

# Servicios
curl -i -s -X POST http://localhost:8001/services --data name=usuarios --data url='http://$IP:5000' --data host='loadbalancer_upstream'
sleep 3
curl -i -s -X POST http://localhost:8001/services --data name=cursos --data url='http://$IP:5001' --data host='loadbalancer_upstream'
sleep 3
curl -i -s -X POST http://localhost:8001/services --data name=procesar --data url='http://$IP:5002' --data host='loadbalancer_upstream'
sleep 3

# Router
curl -i -X POST http://localhost:8001/services/usuarios/routes --data 'paths[]=/usuarios' --data name=usuarios_route
sleep 3
curl -i -X POST http://localhost:8001/services/cursos/routes --data 'paths[]=/cursos' --data name=cursos_route
sleep 3
curl -i -X POST http://localhost:8001/services/procesar/routes --data 'paths[]=/procesar' --data name=procesar_route
