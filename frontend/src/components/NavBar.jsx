import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';

function BasicExample() {
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <div className='espacio'>
    </div>
    </div>
  );
}

export default BasicExample;
