import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-router-dom';
import Context from './Context';
import axios from 'axios';
import { useEffect } from 'react';
import checkAuthentication from '../pages/validationfiles/authService';
import Button from 'react-bootstrap/Button';




function NavbarComponent() {
  const [ user, setUser ] = useContext(Context);
  const [authenticated, setAuthenticated] = useState(false);
  console.log(user);

  // let UserComp = null;
  // if(user.Email != null)
  // {
  //   console.log(user);
  //   UserComp = <Nav.Link className='text-right'> Hello, {user.Email}</Nav.Link>;
  // }

  const handleLogout = (event) => {
    axios.post('http://localhost:3000/logout', null, { withCredentials: true })
      .then(res=> {
        console.log("heyyy");       
      })
      .catch(err => console.log(err));
    }

  useEffect(()=>{
    checkAuthentication()
    .then(authenticated=>{
      setAuthenticated(authenticated);
    })
    .catch(err=>{
      console.error('error in authentication: ', err)
    })
  });

  
  if (authenticated){
    const User1 = axios.get('http://localhost:3000/getuser')
    .then((res) => console.log(res));
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
            {/* {UserComp} */}
          </Nav>
          <div>
            {authenticated ? (
              <div style={{ textAlign: 'right' }}>
                <Nav.Link className='d-inline me-auto' href="/bookinghistory">Booking History</Nav.Link>
                <Nav.Item className='d-inline'> Logged In </Nav.Item>
                <a href="/">
                <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>Logout  </button> 
                </a>
              </div>
            ):
            <div style={{ textAlign: 'right' }}>
              <a href="/login">
              <button type="button" className="btn btn-outline-secondary">Login </button> 
              </a>
              <a href="/signup">
              <button type="button" className="btn btn-outline-secondary">Signup </button> 
              </a>
            </div>}
          </div>
 
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;