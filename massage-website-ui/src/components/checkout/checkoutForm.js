import React, { useContext } from "react";
import './checkout.css';
import {
    PaymentElement,
    LinkAuthenticationElement
  } from '@stripe/react-stripe-js'
  import {useState} from 'react'
  import {useStripe, useElements} from '@stripe/react-stripe-js';
import Context from "../Context";
import dayjs from "dayjs";
import axios from "axios";
  
  export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [booking, setBookingData ] = useContext(Context);

    function createBookingPost(){
      //TODO: Validate fields
      
      var currentDate = dayjs(Date()).format('YYYY-MM-DD HH:mm:ss');
      var startDateTime = booking.Date.format('YYYY-MM-DD HH:mm:ss');
      var EndDateTime = booking.Date.add(booking.Duration,'minute').format('YYYY-MM-DD HH:mm:ss');
      
      let custID = null;
      if(custID === null)
        custID = 49;

      var bookingInput = ({
        CustomerID: custID,
        EmployeeID: booking.Practitioner,
        MassageTypeID: booking.MassageTypeId,
        DateCreated: currentDate,
        DurationInMins: booking.Duration,
        StartDateTime: startDateTime,
        EndDateTime: EndDateTime,
        PriceTotal: booking.Price,
        Status: 'upcoming',
        IsPaid: 1
      })
      console.log(bookingInput)

      axios.post('http://localhost:3000/createbooking', bookingInput)
      .catch(err => console.log(err));
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      
      setIsLoading(true);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/completion`,
        },
      }).then(()=>{
        createBookingPost();
      })

      
  
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
  
      setIsLoading(false);
    }
  
    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement id="link-authentication-element"
          // Access the email value like so:
          // onChange={(event) => {
          //  setEmail(event.value.email);
          // }}
          //
          // Prefill the email field like so:
          // options={{defaultValues: {email: 'foo@bar.com'}}}
          />
        <PaymentElement id="payment-element" />
        <button className="btn_pay" disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Confirm & Pay"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    )
  }
  