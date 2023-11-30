// Navbar.js

import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { navLinks } from "../data/index";
import "./NavBar.css";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);

    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, []);

  return (
    <main>
      <header className={`header ${changeColor ? "color-active" : ""}`}>
        <Container>
          <div className="navigation d-flex align-items-center justify-content-between">
            <div className="logo">
              <h2 className=" d-flex align-items-center gap-1">
                <Navbar.Brand className="fs-3 fw-bold" href="#home">
                  Tecsup
                </Navbar.Brand>
              </h2>
            </div>

            <div className="nav d-flex align-items-center gap-5">
              <Nav className={`nav__menu ${isMobileMenuOpen ? "mobile" : ""}`}>
                {navLinks.map((link) => (
                  <div className="nav__item" key={link.id}>
                    <NavLink
                      to={link.path}
                      className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                      }
                      end
                    >
                      {link.text}
                    </NavLink>
                  </div>
                ))}
              </Nav>

              <div className="nav__right">
                <button className="btn btn-outline-primary text-dark rounded-1">
                  Unete
                </button>
              </div>
            </div>

            <div
              className="mobile__menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span>&#9776;</span>
            </div>
          </div>
        </Container>
      </header>
      {/* Contenido principal de tu aplicación */}
    </main>
  );
};

export default NavbarComponent;
