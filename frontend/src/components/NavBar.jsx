import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './NavBar.css';

function NavBar({ onSearch, onFilterChange, onSortChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' por defecto

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value, selectedFilter);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedFilter(value);
    onFilterChange(searchTerm, value);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    onSortChange(newSortOrder);
  };

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary fixed-top">
        <Container>
          <Navbar.Brand href="/dashboard">Tecsup</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/cursos">Cursos</Nav.Link>
              <Nav.Link href="/carreras">Carreras</Nav.Link>
              <Nav.Link href="/recomendaciones">Recomendaciones</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              
              <Button variant="outline-success" onClick={handleSortChange}>
                Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='espacio'></div>
    </div>
  );
}

export default NavBar;
