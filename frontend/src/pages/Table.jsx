import React from "react";
import NavbarComponent from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { dataFake2 } from "./Data";  
import "./Table.css";

function Table() {
  return (
    <div className="todo">
      <div className="nav">
        <NavbarComponent />
      </div>
      <div className="cards">
          <Row xs={1} md={3} className="g-4">
            {dataFake2.map((carrera) => (
              <Col key={carrera.id}>
                <Card>
                  <Card.Img variant="top" src={carrera.imagenUrl} />
                  <Card.Body>
                    <Card.Title>{carrera.CARRERA}</Card.Title>
                    <Card.Text>
                      Periodo: {carrera.PERIODOS}
                      <br />
                      SEDE: {carrera.SEDES}
                      <br />
                      Contacto: {carrera.CONTACTO}
                      <br />
                      Idioma: {carrera.IDIOMA}
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
