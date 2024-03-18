import React, { useEffect, useReducer, useState } from "react";
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
    const [selectedTime, setTime] = useState('9:00');
    const [selectedPrac, setPrac] = useState();

    const [prac, setPracs] = useState([]);

    useEffect(() => {
        let sel_date = selectedDate.format('YYYY-MM-DD');
        async function fetchData(){
          
            console.log(selectedDate, selectedTime, selectedDuration);
            //fetch("/getavailprac/" + sel_date +" " + time + ":00/" + duration)
            const res = await fetch(`/getavailprac/${sel_date} ${selectedTime}:00/${selectedDuration}`);
            res
            .json()
            .then(res => setPracs(res))
            .catch(err => console.log("Error", err));
            
            return res;
        }
        fetchData();

        console.log("called");
    },[selectedDate, selectedTime]);

    function handleDurationSelect(duration_val){
        console.log(duration_val.target.value)
        setDuration(duration_val.target.value);
    };
    
    function handleDateChange(dateObject){
        setDate(dateObject);
    };

    const [showPrac, setShowPrac] = useState(false); 
    
    function handleHourSelect(selectedHour){
        // Handle the selected hour
        setTime(selectedHour);

        console.log(prac);
        if(prac.length > 0)
        {
            setShowPrac(true);
            console.log("prac component render");
            
        }
        else{
            setShowPrac(false);
        }
        
        // forceUpdate();
    };
    
    let PracComp = null;
    if(showPrac){
        PracComp = <PractitionerComponent onChange={handlePracSelect} practitioners={prac} />;
    } else {
        PracComp = <>hello</>;
    }
    
    function handlePracSelect(selectedPracId){
        console.log(selectedPracId.target.value);
        setPrac(selectedPracId.target.value);
    }
    const handleChanges = (val) => console.log(val.target.value);
    
    return(
        <div className="container">
            booking page here. Your Massage type id is: {params.massageType}
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

            {PracComp}
            
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