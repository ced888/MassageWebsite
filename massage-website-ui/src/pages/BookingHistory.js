import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";
import axios from "axios";



function BookingHistory()
{
    const [bookingsInfo, setBookingInfos] = useState([])

    useEffect (()=>{
        axios.get(`/bookings`)
        .then((res)=>{
          console.log(res);
          if(res.data !== "")
            setBookingInfos(res.data);
        })
    }, []);

    console.log(bookingsInfo);

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
                Practitioner: {bookingInfo.PFirstName} {bookingInfo.PLastName}  <br></br>
                Total Price: ${bookingInfo.PriceTotal}                          <br></br>
                Appointment Date: {bookingInfo.StartDateTime}                   <br></br>
                </Typography>
            </CardContent>
            <CardActions sx={{marginLeft:"auto"}}>
                <Button size="small" color="primary">
                Cancel
                </Button>
            </CardActions>
            </Card>

        ))}
        
    </>);
}

export default BookingHistory;