import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


import styled  from '../css/navbar.module.css'
import { useEffect } from 'react';
import { getAddress } from '../helpers/getAddress';
export default function NavbarComponent() {

const [Address, setAddress] = useState(['0x66ee7A3985D5342BaaE1b7D0FF1BC9FA7Ee9182E','0x4f0bA81E194268f0514Fb0cd4456137eC7E25839']);
const [isAutorized, setisAutorized] = useState(false);

  useEffect(() => {
    getAddress().then(address=> {
      if (Address.includes(address)) {setisAutorized(true)}
    })
    return () => {
      
    };
  }, []);
  return (
    <div>
     <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className={styled.logo}>Sportex marketplace</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/myassets">My Assets</Nav.Link>
            { (isAutorized===true) ?  (
            <Nav.Link as={Link} to="/createitem">Create Item</Nav.Link>) : null }
            
          </Nav>
          <Nav>
          <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Settings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#action/3.2">
                Help
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="#action/3.4">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
   
      
    </div>
  )
            }
