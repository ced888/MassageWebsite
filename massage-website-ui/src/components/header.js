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
import Cookies from 'universal-cookie';



function NavbarComponent() {
  const [ user, setUser ] = useContext(Context);

  const cookies = new Cookies();


  useEffect(() => {  
    //input localstorage email and accesstoken 
    axios.post('http://localhost:3000/getUser', {
      Email: localStorage.getItem('email')
    }, {
      headers: {
        Authorization: "Bearer " + cookies.get('jwt_authorization')
      },
      withCredentials: true
    })
    .then(res => {
      console.log("resdata =", res.data);
      setUser(res.data[0]);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}, []);
  

  const handleLogout = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/logout', {
      token: localStorage.getItem('refreshToken')
    }, {
      headers: {
        Authorization: "Bearer " + cookies.get('jwt_authorization')
      },
      withCredentials: true 
    })
      .then(res=> {    
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email');
        setUser(null);
        cookies.remove('jwt_authorization')
        
      })
      .catch(err => console.log(err));
    } 

  


  return (
    //TODO: Add massage icon img
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light" bg="dark">
      <Container>
        <Navbar.Brand href="/#home">afterthought massage</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="/#services">Services</Nav.Link>
            <Nav.Link href="/contacts">Contacts</Nav.Link>
            {user &&
              <>
              <Nav.Link className='d-inline me-auto' href="/bookinghistory">Booking History</Nav.Link> 
              <Nav.Link className='d-inline me-auto' href="/weeklyschedule">Weekly Schedule</Nav.Link> 
              <Nav.Link className='d-inline me-auto' href="/employeescheduler">Employee Schedule</Nav.Link> 
              </>
            }
          </Nav>
          <div>
            {user ? (
              <div style={{ textAlign: 'right' }}>
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