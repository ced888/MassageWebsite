import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
//import LoginContext from "../components/LoginContext";
import { useContext } from "react";
import Cookies from 'universal-cookie';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

function BookingHistory()
{
    const [bookingsInfo, setBookingInfos] = useState([]);
    const [rating, setRating] = useState(null);

    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect (()=>{
        axios.post('http://localhost:3000/getUserHistory', {
            Email: localStorage.getItem('email')
          }, {
            headers: {
              Authorization: "Bearer " + cookies.get('jwt_authorization')
            },
            withCredentials: true
          })
        .then((res)=>{
          if(res.data !== "")
            setBookingInfos(res.data);
        })
        .catch(error => {
            console.error("Error:", error);
          });
    }, []);

    const handleCancel = (bookingID) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove booking!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Booking has been successfuly cancelled!",
              });
              axios.delete('http://localhost:3000/bookings/delete', {
                headers:{
                Authorization: "Bearer " + cookies.get('jwt_authorization')
                },
                data: {
                    BookingID: bookingID
                },
                withCredentials: true
            }).then((res)=>{
                axios.post('http://localhost:3000/getUserHistory', {
                    Email: localStorage.getItem('email')
                  }, {
                    headers: {
                      Authorization: "Bearer " + cookies.get('jwt_authorization')
                    },
                    withCredentials: true
                  })
                .then((res)=>{
                  if(res.data !== "")
                    setBookingInfos(res.data);
                })
                .catch(error => {
                    console.error("Error:", error);
                  });
            })
            .catch(error => {
                console.error("Error:", error);
              });
            }
          });
        }
        
    /* add after finished ?
            (
              <div>{bookingInfo.Rating === null ? (<Box
              sx={{
                '& > legend': { mt: 2 },
                textAlign:'right',
              }}
            >
            <Typography component="legend">Controlled</Typography>
            <Rating
              name="simple-controlled"
              value={Rating}
              onChange={(event, newRating) => {
              setRating(newRating);
            }}/>
            </Box>) :
                (<Box
              sx={{
                '& > legend': { mt: 2 },
                textAlign:'right',
              }}
            >
             <Typography component="legend">Read only</Typography>
              <Rating name="read-only" value={bookingInfo.Rating} readOnly />
            </Box>)
              }</div>
              )*/
    
    return(
    <>
        
        {bookingsInfo.map((bookingInfo) => (
            <Card key={bookingInfo.BookingID} sx={{ display: "flex", width:"50%", textAlign:"left", marginLeft:"auto", marginRight:"auto", marginTop: "2em", marginBottom:"2em" }}>
            <CardMedia
                component="img"
                sx={{ width: 151, display: "flex", flexDirection: "column" }}
                image={require(`../assets/img/services/services-${bookingInfo.MassageTypeID}.jpg`)}
                alt="Live from space album cover"
            />
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Typography gutterBottom variant="h5" component="div">
                {bookingInfo.MassageType}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                Practitioner: {bookingInfo.PFirstName} {bookingInfo.PLastName}                           <br></br>
                Total Price: ${bookingInfo.PriceTotal}                                                   <br></br>
                Appointment Date: {bookingInfo.StartDateTime.slice(0,-8).split("T").join(" Time:")}      <br></br>
                Status: {bookingInfo.Status}                                                             <br></br>
                </Typography>
            </CardContent>
            { bookingInfo.Status === 'finished' ? 
            (<h1></h1>): (<CardActions sx={{marginLeft:"auto"}}>  
            <Button size="small" color="primary" onClick={() => handleCancel(bookingInfo.BookingID)}>
            Cancel
            </Button>
            </CardActions>)
            }
            </Card>

        ))}
        
    </>);
}

export default BookingHistory;