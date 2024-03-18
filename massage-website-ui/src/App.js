import React, {useState, useEffect} from 'react';
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

function App() {
  const [ stripePromise, setStripePromise ] = useState(null);

  useEffect(() => {
    fetch("/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    
    <div className="App">
      <header id="header">
        <AppNavBar />
      </header>
    
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />}/>
        <Route path="/booking/:massageType" element={<BookingPage />} />
        //change the path of the payment to /payment when in cart with a valid service
        <Route path="/payment" element={<Payment stripePromise={stripePromise} />} />
        <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
      </Routes>
      </BrowserRouter>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default App;
