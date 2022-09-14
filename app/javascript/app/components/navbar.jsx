import React, { useState } from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { useEffect } from "react";
import { useAddress } from "../hooks/useAddress";

import styled from "../css/navbar.module.css";

export default function NavbarComponent() {
    const { isAutorized } = useAddress();

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className={styled.logo}>
            Sportex marketplace
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/myassets">
                <i class="fa-solid fa-cart-shopping"></i> My Assets
              </Nav.Link>
              {isAutorized === true ? (
                <Nav.Link as={Link} to="/createitem">
                  <i class="fa-solid fa-plus"></i> Create Item
                </Nav.Link>
              ) : null}
            </Nav>
            <Nav className="mr-auto">
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  <i class="fa-solid fa-gear"></i> Settings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="#action/3.2">
                  <i class="fa-solid fa-circle-info"></i> Help
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/users/sign_out">
                  <i class="fa-solid fa-right-from-bracket"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
