import React, { useState, useEffect } from "react";
import NavbarComponent from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaStar } from 'react-icons/fa';
import "./Course.css";
import Container from 'react-bootstrap/Container';

function Recomendaciones() {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' por defecto

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://ip172-18-0-30-clr6qjcsnmng00drrcc0-5001.direct.labs.play-with-docker.com/cursos");
        const data = await response.json();
        const storedValoraciones = JSON.parse(localStorage.getItem("valoraciones")) || {};
        const cursosWithValoraciones = data.cursos.map(curso => {
          return {
            ...curso,
            valoracion: storedValoraciones[curso.curso_id] || curso.valoracion
          };
        });
        setCursos(cursosWithValoraciones);
        filterAndSortCursos(cursosWithValoraciones);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterAndSortCursos = (data) => {
    let filteredCursos = data;

    filteredCursos = filteredCursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === 'asc') {
      filteredCursos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      filteredCursos.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    setFilteredCursos([...filteredCursos]);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterAndSortCursos(cursos);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    filterAndSortCursos(cursos);
  };

  const handleStarClick = (cursoId, valoracion) => {
    const updatedCursos = cursos.map(curso => {
      if (curso.curso_id === cursoId) {
        saveValoracionToLocalStorage(cursoId, valoracion);
        return {
          ...curso,
          valoracion: valoracion
        };
      }
      return curso;
    });
    setCursos(updatedCursos);
    filterAndSortCursos(updatedCursos);
  };

  const saveValoracionToLocalStorage = (cursoId, valoracion) => {
    const storedValoraciones = JSON.parse(localStorage.getItem("valoraciones")) || {};
    storedValoraciones[cursoId] = valoracion;
    localStorage.setItem("valoraciones", JSON.stringify(storedValoraciones));
  };

  return (
    <div className="todo">
      <NavbarComponent onSearch={handleSearch} onSortChange={handleSortChange} />
      <div className="cards">
      <Container className="container-margin">
        <Row xs={1} lg={4} className="g-4">
          {filteredCursos.map((curso) => (
            <Col key={curso.curso_id}>
              <Card className="card-small">
                <Card.Img variant="top" src='http://blog.tecsupvirtual.edu.pe/wp-content/uploads/2018/05/canvas_plataforma_educacion_virtual_tecsup_1.jpg' />
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
                    <br />
                    Valoración: {renderStarRating(curso.curso_id, curso.valoracion)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </Container>
      </div>
    </div>
  );

  function renderStarRating(cursoId, valoracion) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= valoracion ? '#ffc107' : '#e4e5e9'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleStarClick(cursoId, i)}
        />
      );
    }
    return stars;
  }
}

export default Recomendaciones;