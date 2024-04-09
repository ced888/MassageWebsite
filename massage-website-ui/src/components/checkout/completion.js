import React, { useContext } from 'react';
import {useEffect, useState} from 'react';
import Context from '../Context';
import dayjs from 'dayjs';
import axios from 'axios';


function Completion(props) {
  const [ messageBody, setMessageBody ] = useState('');
  const { stripePromise } = props;

  let isNotCalled = true;
  // const [booking, setBookingData ] = useContext(Context);

  // function createBookingPost(paid){
  //   //TODO: Validate fields
    
  //   if(booking && isNotCalled)
  //   {
  //     var currentDate = dayjs(Date()).format('YYYY-MM-DD HH:mm:ss');
  //     var startDateTime = booking.Date.format('YYYY-MM-DD HH:mm:ss');
  //     var EndDateTime = booking.Date.add(booking.Duration,'minute').format('YYYY-MM-DD HH:mm:ss');
      
  //     let custID = localStorage.getItem('customerid');
  //     if(custID === null)
  //       custID = 49;
  
  //     var bookingInput = ({
  //       CustomerID: custID,
  //       EmployeeID: booking.Practitioner,
  //       MassageTypeID: booking.MassageTypeId,
  //       DateCreated: currentDate,
  //       DurationInMins: booking.Duration,
  //       StartDateTime: startDateTime,
  //       EndDateTime: EndDateTime,
  //       PriceTotal: booking.Price,
  //       Status: 'upcoming',
  //       IsPaid: paid
  //     })
  //     console.log(bookingInput)
  
  //     axios.post('http://localhost:3000/createbooking', bookingInput)
  //     .then(res=> {
  //       console.log(res);
  //       //navigate('/completion');
  //     })
  //     .catch(err => console.log(err));
  //   }
  // }

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then(async (stripe) => {
      const url = new URL(window.location);

      //Check if payment went through
      try{
        const clientSecret = url.searchParams.get('payment_intent_client_secret');
        const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        setMessageBody(error ? `> ${error.message}` : (
          <>&gt; Payment {paymentIntent.status}: <a href={`https://dashboard.stripe.com/test/payments/${paymentIntent.id}`} target="_blank" rel="noreferrer">{paymentIntent.id}</a></>
        ));

        isNotCalled = false;
      }
      //Otherwise, process non payment here
      catch{
        isNotCalled = false;
        console.log("unpaid booking created")
      }
    });
  }, [stripePromise]);

  return (
    <>
      <h1>Thank you!</h1>
      <h2>Your Booking has been completed, you can check it in the booking history.</h2>
      <a href="/bookinghistory">Booking History</a>
      <div id="messages" role="alert" style={messageBody ? {display: 'block'} : {}}>{messageBody}</div>
    </>
  );
}

export default Completion;
