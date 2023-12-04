import React, { useState, useEffect } from "react";
import NavbarComponent from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./Course.css";

function Table() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://ip172-18-0-13-cln533ogftqg00fboehg-5001.direct.labs.play-with-docker.com/cursos");
        const data = await response.json();
        setCursos(data.cursos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="todo">
      <div className="nav">
        <NavbarComponent />
      </div>
      <div className="cards">
        <Row xs={1} md={3} className="g-4">
          {cursos.map((curso) => (
            <Col key={curso.curso_id}>
              <Card>
                {/* Agrega tu lógica para manejar la imagen (curso.imagenUrl) si es necesario */}
                <Card.Body>
                  <Card.Title>{curso.nombre}</Card.Title>
                  <Card.Text>
                    Profesor: {curso.profesor}
                    <br />
                    Carrera: {curso.carrera}
                    <br />
                    Clase: {curso.clase}
                    <br />
                    Idioma: {curso.idioma}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Table;

