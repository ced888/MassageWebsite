import React, { useEffect, useContext, useState } from "react";
import AppDatePicker from '../components/booking/datepicker';
import TimeslotComponent from '../components/booking/timeslot';
import PractitionerComponent from "../components/booking/practitioner";
import dayjs from 'dayjs';
import { useNavigate, useParams } from "react-router-dom";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import Context from "../components/Context";
import Cookies from "universal-cookie";
import axios from "axios";


function BookingPage(){
    
    const params = useParams();
    const [selectedDuration, setDuration] = useState(60);
    const [selectedDate, setDate] = useState(dayjs(Date()));
    const [selectedTime, setTime] = useState('9:00');
    const [selectedPrac, setPrac] = useState();

    const [prac, setPracs] = useState([]);

    const [booking, setBookingData ] = useContext(Context);

    const [ user, setUser ] = useState(Context);
    const cookies = new Cookies();
    useEffect(() => {  
        //input localstorage email and accesstoken 
        axios.post('http://localhost:3000/getUser', {
          Email: localStorage.getItem('email')
        }, {
          headers: {
            Authorization: "Bearer " + cookies.get('jwt_authorization')
          },
          withCredentials: true
        })
        .then(res => {
          console.log("resdata =", res.data);
          setUser(res.data[0]);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }, []);

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
        console.log(params);
        setDuration(duration_val.target.value);
    };
    
    function handleDateChange(dateObject){
        setDate(dateObject);
        setPrac(undefined);
    };

    const [showPrac, setShowPrac] = useState(false); 
    
    function handleHourSelect(selectedHour){
        // Handle the selected hour
        setTime(selectedHour);
        setPrac(undefined);
            
        var time = selectedHour.split(":");
        setDate(selectedDate.set('hour', time[0]).set('minute', time[1]).set('second', 0));
        console.log(prac);
        if(prac.length > 0)
        {
            setShowPrac(true);
            console.log("prac component render");
        }
        else{
            setShowPrac(false);
        }
    };
    
    let PracComp = null;
    if(showPrac){
        PracComp = <>
        <br></br>
        Which Practitioner would you prefer?
        <PractitionerComponent onChange={handlePracSelect} practitioners={prac} />
        </>;
    } else {
        PracComp = <>Please select the following:</>;
    }
    
    function handlePracSelect(selectedPracId){
        console.log(selectedPracId.target.value);
        setPrac(selectedPracId.target.value);
    }
    const handleChanges = (val) => console.log(val.target.value);
    
    const navigate = useNavigate();
    function HandleSubmit(){
        
        setBookingData({
            CustomerId: user.CustomerID,
            MassageType:params.massageType,
            MassageTypeId:params.massageTypeId, 
            Date:selectedDate, 
            Time:selectedTime, 
            Duration:selectedDuration,
            Practitioner: selectedPrac,
            Price:null,
        });
        console.log(booking);
        navigate('/payment');
    }

    return(
        <div className="container">
            <h3>You've selected {params.massageType}</h3>
            <div>
                <InputLabel id="demo-simple-select-label">How long would you like your massage?</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDuration}
                    label="Massage Duration"
                    onChange={handleDurationSelect}
                >
                    <MenuItem value={45}>45 Minutes</MenuItem>
                    <MenuItem value={60}>60 Minutes</MenuItem>
                    <MenuItem value={75}>75 Minutes</MenuItem>
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
            
            
            <Button variant="contained" disabled={selectedTime === undefined || selectedPrac === undefined} onClick={HandleSubmit}> Book Now </Button>
        </div>
    );
}

export default BookingPage;