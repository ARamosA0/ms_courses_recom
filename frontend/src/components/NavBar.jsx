// NavBar.jsx
import React from 'react';
import { useAuth } from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Navbar expand="lg" className="fixed-top">
        <Container>
          <Navbar.Brand href="/dashboard">Tecsup</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <NavLink to="/cursos" className="nav-link" activeClassName="active">
                Cursos
              </NavLink>
              <NavLink to="/carreras" className="nav-link" activeClassName="active">
                Carreras
              </NavLink>
              <NavLink to="/recomendaciones" className="nav-link" activeClassName="active">
                Recomendaciones
              </NavLink>
              <div className="vertical-line"></div>
              {user && (
                <NavDropdown title={user.name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="espacio"></div>
    </div>
  );
}

export default NavBar;
