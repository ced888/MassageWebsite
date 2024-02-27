import React, { useState } from "react";
import AppDatePicker from '../components/booking/datepicker';
import TimeslotComponent from '../components/booking/timeslot';
import PractitionerComponent from "../components/booking/practioner";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputLabel, MenuItem, Select } from "@mui/material";


function BookingPage(){
    
    const params = useParams();
    const [selectedDuration, setDuration] = useState(90);
    const [selectedDate, setDate] = useState(dayjs(Date()));
    const [selectedTime, setTime] = useState();
    const [selectedPrac, setPrac] = useState();

    function handleDurationSelect(duration_val){
        console.log(duration_val.target.value)
        setDuration(duration_val.target.value);
    };
    
    function handleDateChange(dateObject){
        setDate(dateObject);
    };

    function handleHourSelect(selectedHour){
        // Handle the selected hour
        console.log(`Hour ${selectedHour} selected`);
        setTime(selectedHour);
    };
    
    function handlePracSelect(selectedPracId){
        console.log(selectedPracId.target.value);
        setPrac(selectedPracId.target.value);
    }
    const handleChanges = (val) => console.log(val.target.value);
    
    return(
        <div className="container">
            booking page here. Your Massage type id is: {params.id}
            <div>
                <InputLabel id="demo-simple-select-label">How long would you like your massage?</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDuration}
                    label="Massage Duration"
                    onChange={handleDurationSelect}
                >
                    <MenuItem value={30}>30 Minutes</MenuItem>
                    <MenuItem value={60}>60 Minutes</MenuItem>
                    <MenuItem value={90}>90 Minutes</MenuItem>
                </Select>
            </div>

            <AppDatePicker 
            sel_date = {selectedDate} 
            onChange = {handleDateChange}/>

            <TimeslotComponent 
            startHour={9} 
            endHour={18}
            duration={selectedDuration}
            onHourSelect={handleHourSelect}/>
            
            <PractitionerComponent 
            onChange={handlePracSelect}/>
            
            <div>
            Selected duration is {selectedDuration} <br></br>
            Selected date is {selectedDate.toString()}<br></br>
            Selected time is {selectedTime}<br></br>
            Selected Practitioner is {selectedPrac}<br></br>
            </div>
            
            <Button variant="contained" href={"/payment/" +''}> Book Now </Button>

        </div>
    );
}

export default BookingPage;