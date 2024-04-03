import React from "react";
import {useEffect, useState, useContext} from 'react';
import axios from "axios";
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './checkoutForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import Context from "../Context";
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Button, TextField } from "@mui/material";
import dayjs from 'dayjs';


function Payment(props) {
  const { stripePromise } = props;
  const [ clientSecret, setClientSecret ] = useState('');

  const [ booking, setBooking ] = useContext(Context);
  const [ selectedPrac, setPrac ] = useState({});
  const [ bookingPrice, setPrice ] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/payment/create-payment-intent")
      .then((res) => res.json())
      .then(({clientSecret}) => setClientSecret(clientSecret));
  }, []);

  //Get employee information in booking
  useEffect (() =>{
    axios.get(`/employees/${booking.Practitioner}`)
    .then((res) =>{
      if(res.data !== "")
        setPrac(res.data[0][0]);
    })
  }, []);

  //Get booking price
  useEffect (()=>{
    axios.get(`/massageprice/${booking.MassageTypeId}/${booking.Duration}`)
    .then((res)=>{
      console.log(res);
      if(res.data !== "")
        setPrice(res.data[0][0]);
        booking.Price = res.data[0][0].Price;
    })
  }, []);

  let BookingComp = null;
  if(Object.keys(booking).length !== 0)
  {
    console.log(booking);
    console.log(selectedPrac);
    console.log(bookingPrice);
    BookingComp = 
    <>
    <h4>{booking.MassageType}</h4>
    Appointment details:                        <br></br>
    Date: {booking.Date.format("MMM DD YYYY")}  <br></br>
    Time: {booking.Time}                        <br></br>
    Duration: {booking.Duration} Minutes        <br></br>

    With practitioner {selectedPrac.FirstName} {selectedPrac.LastName} <br></br><br></br>
    
    Total Price: ${bookingPrice.Price}.00
    </>;
  }
  else{
    navigate('/');
  }

  function handleSubmit(){
    //TODO: Validate fields
    var currentDate = dayjs(Date()).format('YYYY-MM-DD HH:mm:ss');
    var startDateTime = booking.Date.format('YYYY-MM-DD HH:mm:ss');
    var EndDateTime = booking.Date.add(booking.Duration,'minute').format('YYYY-MM-DD HH:mm:ss');

    let custID = localStorage.getItem('customerid');
      if(custID === null)
        custID = 49;

    var bookingInput = ({
      CustomerID: custID,
      EmployeeID: selectedPrac.EmployeeID,
      MassageTypeID: booking.MassageTypeId,
      DateCreated: currentDate,
      DurationInMins: booking.Duration,
      StartDateTime: startDateTime,
      EndDateTime: EndDateTime,
      PriceTotal: bookingPrice.Price,
      Status: 'upcoming',
      IsPaid: 0
    })
    console.log(bookingInput)

    axios.post('http://localhost:3000/createbooking', bookingInput)
    .then(res=> {
      console.log(res);
      navigate('/completion');
    })
    .catch(err => console.log(err));
  }



  let stripe = clientSecret && stripePromise && (
    <Elements stripe={stripePromise} options={{ clientSecret, }}>
      <CheckoutForm />
    </Elements>
  )

  let confirmationComp = 
  <>
       <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Would you like to pay ahead?
        </AccordionSummary>
        <AccordionDetails>
          {stripe}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          No thanks, I'll pay at the salon
        </AccordionSummary>
        <AccordionDetails>
          Please enter your email <br></br>
          <TextField id="outlined-basic" label="Email" variant="outlined" value={localStorage.getItem('email')}/>
          <Button variant="contained" onClick={handleSubmit}> Confirm </Button>
        </AccordionDetails>
      </Accordion>
  </>

  return (
    <div className="container">
      <h2>Booking Confirmation</h2>
      <div className="row">
        <div className="col-lg">
          {BookingComp}
        </div>
        <div className="col-sm">
          {confirmationComp}
        </div>
      </div>
    </div>
  );
}

export default Payment;
