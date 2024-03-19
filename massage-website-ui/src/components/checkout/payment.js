import React from "react";
import {useEffect, useState, useContext} from 'react';
import axios from "axios";
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './checkoutForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import Context from "../Context";



function Payment(props) {
  const { stripePromise } = props;
  const [ clientSecret, setClientSecret ] = useState('');

  
  const [ bookings, setBookings ] = useState({});
  const [ booking, setBooking ] = useContext(Context);
  const [ selectedPrac, setPrac ] = useState({});

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/payment/create-payment-intent")
      .then((res) => res.json())
      .then(({clientSecret}) => setClientSecret(clientSecret));
  }, []);
  

  // useEffect (() =>{
  //   axios.get(`/employees/${booking.Practitioner}`)
  //   .then((res) =>{
  //     console.log(res)
  //     setPrac(res.data);
  //   })
  // })

  // let BookingComp = null;
  // if(selectedPrac !== undefined)
  // {
  //   console.log(booking);
  //   BookingComp = 
  //   <>
  //   <h4>You will book {booking.MassageType}</h4>
  //   Booking details:                  <br></br>
  //   Date: {booking.Date.toString()}   <br></br>
  //   Time: {booking.Time}              <br></br>
  //   Duration: {booking.Duration}      <br></br>

  //   With practitioner {selectedPrac.FirstName} {selectedPrac.LastName}
    
  //   </>;
  // }


  return (
    <div className="container">
      <h2>Payment</h2>
      <div className="row">
        <div className="col-lg">
          Massage information here
          {BookingComp}
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
