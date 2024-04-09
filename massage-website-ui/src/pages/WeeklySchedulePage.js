import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PractitionerSchedule from '../components/PractitionerSchedule';

function WeeklySchedulePage() {
  const [user,setUser] = useState({});
  
  useEffect(() => {  
    //input localstorage email and accesstoken 
    axios.post('http://localhost:3000/getUser', {
      Email: localStorage.getItem('email')
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('accessToken')
      },
      withCredentials: true
    })
    .then(res => {
      console.log(res.data);
      setUser(res.data[0]);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }, []);

  return (
    <div>
      <h1>Weekly Practitioner Schedule</h1> <br></br>
      <PractitionerSchedule 
        employeeID = {user.EmployeeID}/>
    </div>
  );
}

export default WeeklySchedulePage;
