import React from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "./style.css";

const NavbarComponent = () => {
  function logout() {
    console.log("ENTRA");
    fetch("http://localhost:3000/users/sign_out", {
      // fetch("https://sportex-staging.herokuapp.com/users/sign_out", {
      method: "GET",
    })
      .then(() => {
        console.log("logged out");
        // redirigir a la página de inicio de sesión
        window.location.href = "/users/sign_in";
      })
      .catch((errs) => {
        console.log(errs);
      });
  }
  console.log("ENTRA NAV");
  const isAutorized = true
  return (
    <div>
      <Navbar
        style={{ background: "#0f1b2f" }}
        collapseOnSelect
        expand="lg"
        variant="dark"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="logo">
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav id="links" className="me-auto">
              <Nav.Link as={Link} to="/myassets">
                <i className="fa-solid fa-cart-shopping"></i> My Assets
              </Nav.Link>
              {isAutorized === true ? (
                <Nav.Link as={Link} to="/createitem">
                  <i className="fa-solid fa-plus"></i> Create Item
                </Nav.Link>
              ) : null}
            </Nav>
            <Nav className="mr-auto">
              <NavDropdown
                className="links"
                style={{ marginRight: "40px" }}
                title="Profile"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="fa-solid fa-gear"></i> Settings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="#action/3.2">
                  <i className="fa-solid fa-circle-info"></i> Help
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => logout()}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
export default NavbarComponent;
