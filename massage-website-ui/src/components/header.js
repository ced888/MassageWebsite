import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-router-dom';
import Context from './Context';

function NavbarComponent() {
  const [ user, setUser ] = useContext(Context);
  console.log(user);

  let UserComp = null;
  if(user.Email != null)
  {
    console.log(user);
    UserComp = <Nav.Link className='text-right'> Hello, {user.Email}</Nav.Link>;
  }

  return (
    //TODO: Add massage icon img
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light" bg="dark">
      <Container>
        <Navbar.Brand href="#home">afterthought massage</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="/#services">Services</Nav.Link>
            <Nav.Link href="/contacts">Contacts</Nav.Link>
            {UserComp}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;