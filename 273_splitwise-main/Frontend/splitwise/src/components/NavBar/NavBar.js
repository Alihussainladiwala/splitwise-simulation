/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Navbar, Form, Nav, Button } from 'react-bootstrap';
import './NavBar.css';

// eslint-disable-next-line react/prefer-stateless-function
class NavigationBar extends Component {
  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Navbar className="nav-bar" expand="lg">
        <Navbar.Brand href="#home">SplitWise</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Form inline>
            <Nav.Link href="/login">LogIn</Nav.Link>
            <Button href="/signUp" variant="outline-success">
              Sign Up
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
