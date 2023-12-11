// Table.jsx
import React, { useState } from 'react';
import NavbarComponent from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaStar } from 'react-icons/fa';
import { dataFake2 } from "./Data";
import "./Table.css";

function Table() {
  const [filteredData, setFilteredData] = useState([...dataFake2]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(null);

  const handleSearch = (term, filterValue) => {
    setSearchTerm(term);
    filterCourses(term, filterValue);
  };

  const handleFilterChange = (term, filterValue) => {
    setFilter(filterValue);
    filterCourses(term, filterValue);
  };

  const handleSortChange = () => {
    const newSortBy = sortBy === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    sortCourses(newSortBy);
  };

  const sortCourses = (sortOrder) => {
    const sortedCourses = [...filteredData].sort((a, b) => {
      const comparison = a.CARRERA.localeCompare(b.CARRERA, 'en', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredData(sortedCourses);
  };

  const filterCourses = (term, filterValue) => {
    let filteredCourses = dataFake2;

    if (filterValue !== 'all') {
      filteredCourses = filteredCourses.filter((carrera) => carrera.VALORACION === parseInt(filterValue, 10));
    }

    filteredCourses = filteredCourses.filter((carrera) =>
      carrera.CARRERA.toLowerCase().includes(term.toLowerCase())
    );

    // Si hay un orden establecido, aplica el orden después de aplicar los filtros
    if (sortBy) {
      sortCourses(sortBy);
    } else {
      setFilteredData([...filteredCourses]);
    }
  };

  return (
    <div className="todo">
      <NavbarComponent onSearch={handleSearch} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
      <div className="cards">
        <Row xs={1} md={3} className="g-4">
          {filteredData.map((carrera) => (
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
                    <br />
                    Valoración: {renderStarRating(carrera.id, carrera.VALORACION)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  function renderStarRating(carreraId, valoracion) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= valoracion ? '#ffc107' : '#e4e5e9'}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return stars;
  }
}

export default Table;
