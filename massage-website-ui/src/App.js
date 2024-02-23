import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import AppNavBar from './components/header';
import AppHero from './components/hero';
import AppServices from './components/services';
import Footer from './components/footer';

import AppDatePicker from './components/datepicker';

import Payment from './components/checkout/payment';
import Completion from './components/checkout/completion';


import {loadStripe} from '@stripe/stripe-js';


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

      <main>
        <AppHero />

        <AppServices />
        
        <AppDatePicker/>

        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Payment stripePromise={stripePromise} />} />
          <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
        </Routes>
        </BrowserRouter>

      </main>
      <Footer />
    </div>
  );
}

export default App;
