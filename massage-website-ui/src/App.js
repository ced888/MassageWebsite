import React, {useState, useEffect, useContext} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AppNavBar from './components/header';
import Footer from './components/footer';

import Payment from './components/checkout/payment';
import Completion from './components/checkout/completion';

import {loadStripe} from '@stripe/stripe-js';

import BookingPage from './pages/booking';
import Homepage from './pages/homepage';
import BookingHistory from './pages/BookingHistory';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Context from './components/Context'; 
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
//import LoginContext from './components/LoginContext';
import Cookies from 'universal-cookie';

function App() {
  const [ stripePromise, setStripePromise ] = useState(null);

  //const [ accessToken1, setAccessToken ] = useState(null);
  const [ user, setUser ] = useState(null);

  const [ booking, setBooking ] = useState({});
  const cookies = new Cookies();

  useEffect(() => {
    fetch("/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

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

      //refreshToken
    })
    .catch(error => {
      console.error("Error:", error);
    });
}, []);


  const refreshToken = async ()=>{
    try{
      const res = await axios.post("/refresh", {token: cookies.get('refresh_token')}, { withCredentials: true });
      cookies.set("jwt_authorization", res.data.accessToken, {
      });
      cookies.set("refresh_token", res.data.refreshToken, {
      });
    }catch(err){
      console.log(err)
    }
  }

/*
  axios.interceptors.request.use(async () =>{
    let currentDate = new Date();
    const decodedToken = jwtDecode(localStorage.getItem('accessToken'))
    if(decodedToken.exp * 1000 < currentDate.getTime()){
      const data = await refreshToken()
    }
  });
*/
  return (
    <>
    <div className="App">
        <Context.Provider value={[user, setUser]}>
          <header id="header">
            <AppNavBar />
          </header>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Homepage />}/>
              <Route path="/booking/:massageType/:massageTypeId" element={<BookingPage />} />
              <Route path="/payment" element={<Payment stripePromise={stripePromise} />} />
              <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
              <Route path="/bookinghistory" element={<BookingHistory />} />
              <Route path="/login" element = {<Login />}/>
              <Route path="/signup" element = {<Signup />}/>
            </Routes>
          </BrowserRouter>
          <footer>
            <Footer/>
          </footer>
        </Context.Provider>
    </div>
    </>
  );
}

export default App;
