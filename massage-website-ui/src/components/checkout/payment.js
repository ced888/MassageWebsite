import React from "react";
import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './checkoutForm'
import 'bootstrap/dist/css/bootstrap.min.css';

function Payment(props) {
  const { stripePromise } = props;
  const [ clientSecret, setClientSecret ] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/payment/create-payment-intent")
      .then((res) => res.json())
      .then(({clientSecret}) => setClientSecret(clientSecret));
  }, []);


  return (
    <div className="container">
      <h2>Payment</h2>
      <div className="row">
        <div className="col-lg">
          Massage information here
        </div>
        <div className="col-sm">
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret, }}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;
