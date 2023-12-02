import React from "react";
import NavbarComponent from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { dataFake } from "./Data";  
import "./Course.css";

function Table() {
  return (
    <div className="todo">
      <div className="nav">
        <NavbarComponent />
      </div>
      <div className="cards">
          <Row xs={1} md={3} className="g-4">
            {dataFake.map((curso) => (
              <Col key={curso.id}>
                <Card>
                  <Card.Img variant="top" src={curso.imagenUrl} />
                  <Card.Body>
                    <Card.Title>{curso.CURSO}</Card.Title>
                    <Card.Text>
                      Profesor: {curso.PROFESOR}
                      <br />
                      Carrera: {curso.CARRERA}
                      <br />
                      Clase: {curso.CLASE}
                      <br />
                      Idioma: {curso.IDIOMA}
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
