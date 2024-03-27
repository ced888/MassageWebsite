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
import LoginContext from './LoginContext';




function NavbarComponent() {
  const [user,setUser] = useState(null);


  

  const handleLogout = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/logout', {
      token: localStorage.getItem('refreshToken')
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('accessToken')
      },
      withCredentials: true 
    })
      .then(res=> {    
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email');
        setUser(null);
      })
      .catch(err => console.log(err));
    } 

  
    useEffect(() => {  
        //input localstorage email and accesstoken 
        axios.post('http://localhost:3000/getUser', {
          Email: localStorage.getItem('email')
        }, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('accessToken')
          },
          withCredentials: true
        })
        .then(res => {
          console.log(res.data);
          setUser(res.data[0]);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }, []);

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

          </Nav>
          <div>
            {user ? (<div style={{ textAlign: 'right' }}>
            <Nav.Link className='text-right'> {"Hello " + user.FirstName + " "+ user.LastName}</Nav.Link>
            <Nav.Link href="/">
            <button type="button" onClick={handleLogout}>Logout  </button> 
            </Nav.Link>
          </div>
            ) :
            (<div style={{ textAlign: 'right' }}>
              <Nav.Link href="/login">
              <button type="button">Login </button> 
              </Nav.Link>
              <Nav.Link href="/signup">
              <button type="button">Signup </button> 
              </Nav.Link>
            </div>)}
            </div>
 
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;