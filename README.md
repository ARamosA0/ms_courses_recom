# **ARQUITECTURA DE MS**

## **Despliege con Docker compose**

Para desplegar en docker play, es necesario cambiar los links de las apis en los archivos del frontend 
-  api.jsx
-  Courses.jsx
-  CreateUser.jsx
-  Login.jsx
-  Recomendaciones.jsx

```shell
docker compose up -d
```

## **Api de recomendacion**

Link de repositorio usado para el procesamiento de datos

[REPO](https://github.com/ARamosA0/img-docker-20m)

La api esta en una instancia ES2 en AWS 

[LINK](http://52.90.25.69:5000)
[LINK2](http://ec2-52-90-25-69.compute-1.amazonaws.com/)

## **DOCKER SWARM**
```shell
docker stack deploy --compose-file docker-stack.yml recomend
```


---

## **Diagramas**

- [Diagramas](https://miro.com/welcomeonboard/a3dXYmtpaVpZcVhzaWNWaDZlYUVEd1dvS2I0SFVlekhwbGkxdlJnUE9sVEgxWFczb0FDZW56WVdFR2VYajltdnwzNDU4NzY0NTM0Mjk4NTg0NjA0fDI=?share_link_id=519012505508)

- [IMAGEN](https://github.com/ARamosA0/ms_courses_recom/blob/main/diagrama.jpg)
## **Figma**

- [Front](https://www.figma.com/proto/Ot6bc82rw3QlpVmaINKZms/UI-Design-System-Recomendation?type=design&node-id=49-422&t=pK2g5gepaGibhshK-0&scaling=scale-down&page-id=0%3A1)

---

## **Comandos**

- docker compose up -d 

---

## **Puertos**

- [front localhost:3000](http://localhost:3000)

---

## **API GATEWAY**

La API Gateway esta echa en KONG usando una base de datos PosrtgeSQL 

#### **Comandos para conectar los servicios**

Hacer estos comandos para crear servicios y routes.

Hay dos formas para hacer esto, mediante postman y mediante terminal

Para ambas es importante conocer la IP de tu computadora, **IMPORTANTE** reemplazar *IP* de las urls

#### CURL

**Load Balancer**
```
curl -X POST http://localhost:8001/upstreams \
  --data name=loadbalancer_upstream
```

```
curl -X POST http://localhost:8001/upstreams/loadbalancer_upstream/targets \
  --data target='http://IP:5000'
```

```
curl -X POST http://localhost:8001/upstreams/loadbalancer_upstream/targets \
  --data target='http://IP:5001'
```

**Servicios**

```
curl -i -s -X POST http://localhost:8001/services \
  --data name=usuarios \
  --data url='http://ip:5000' \
  --data host='loadbalancer_upstream'
  ```

  ```
curl -i -s -X POST http://localhost:8001/services \
  --data name=cursos \
  --data url='http://ip:5001' \
  --data host='loadbalancer_upstream'
  ```

  ```
curl -i -s -X POST http://localhost:8001/services \
  --data name=procesar \
  --data url='http://ip:5002' \
  --data host='loadbalancer_upstream'
  ```

  **Router**

  ```
  curl -i -X POST http://localhost:8001/services/usuarios/routes \
  --data 'paths[]=/usuarios' \
  --data name=usuarios_route
  ```

  ```
  curl -i -X POST http://localhost:8001/services/cursos/routes \
  --data 'paths[]=/cursos' \
  --data name=cursos_route
  ```

  ```
  curl -i -X POST http://localhost:8001/services/procesar/routes \
  --data 'paths[]=/procesar' \
  --data name=procesar_route
  ```


##### *POSTMAN*

**Load Balancer**

- {http://localhost:8001/upstreams}
- {
    {
    "name":"loadbalancer_upstream"
    }
}
- **IMPORTANTE** Cambiar el puerto con 5001, 5002 al crear tres targets 
- {http://localhost:8001/upstreams/loadbalancer_upstream/targets}
- {
    {
    "target":"*IP*:5000"
    }
}


**SERVICIOS**
- {http://localhost:8001/services/}
- {
    {
    "name":"usuarios",
    "url": "http://*IP*:5000",
    "host":"loadbalancer_upstream"
    }
}
- {http://localhost:8001/services/}
- {
    {
    "name":"cursos",
    "url": "http://*IP*:5001",
    "host":"loadbalancer_upstream"
    }
}
- {http://localhost:8001/services/}
- {
    {
    "name":"procesar",
    "url": "http://*IP*:5002",
    "host":"loadbalancer_upstream"
    }
}
- {http://localhost:8001/services/usuarios/routes}
- {
    {
    "name":"usuarios-route",
    "paths":["/usuarios"]
    }   
}
- {http://localhost:8001/services/cursos/routes}
- {
    {
    "name":"cursos-route",
    "paths":["/cursos"]
    }   
}
- ```http://localhost:8001/services/procesar/routes```
- ```
    {
    "name":"procesar-route",
    "paths":["/procesar"]
    }   
```


## KAFKA

Para crear topics entrar en el contenedor de docker con el siguiente comando

```docker exec -it [container_id] /bin/bash```

Una vez dentro copiar el siguiente comando 

```kafka-topics --create --bootstrap-server localhost:29092 --partitions 2 --replication-factor 1 --topic [nombre_del_topic]```

o

```docker exec -it [container_id] kafka-topics --create --bootstrap-server localhost:29092 --partitions 2 --replication-factor 1 --topic [nombre_del_topic]````

Para ver los topics 

```kafka-topics --list --bootstrap-server localhost:29092 ```
