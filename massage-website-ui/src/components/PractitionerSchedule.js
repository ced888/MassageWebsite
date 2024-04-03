import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./PractitionerSchedule.css";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";

function Calendar(EmployeeID) {
  const calendarRef = useRef();

  const [practitioners, setPractitioners] = useState([]);
  const [practitioner, setPractitioner] = useState({employeeId: ''});

  useEffect (()=>{
    axios.get(`/employees/prac`)
    .then((res)=>{
      console.log(res);
      if(res.data !== "")
        setPractitioners(res.data);
    })
  }, []);


  const editEvent = async (e) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
    if (!modal.result) {
      return;
    }
    e.data.text = modal.result;
    dp.events.update(e);
  };

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onEventClick: async (args) => {
      await editEvent(args.e);
    },
    onBeforeEventRender: (args) => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          //symbol: "icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
      ];

      const services = args.data.MassageTypeID;
      args.data.areas.push({
        bottom: 5,
        right: 5 + 1 * 30,
        width: 24,
        height: 24,
        image: `https://picsum.photos/24/24?random=${services}`,
        //image: `../assets/img/services/services-${services}.jpg`,
        style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      });
      let event_color = { 7: "#6aa84f", 8: "#f1c232", 9: "#cc4125", 10: "#FA9EBC" };
      args.data.backColor = event_color[services];
    },
  });

  useEffect (()=>{
    let events;
    if(practitioner.employeeId != '')
    {
      axios.get(`/bookingsbyemployee/${practitioner.employeeId}`)
      .then((res)=>{
        events = res.data;
        console.log(res);
      })
      .then(()=>{
        const currDate = new Date();
        calendarRef.current.control.update({ currDate, events });
      })
    }
  },[practitioner])

  return (
    <>
    <FormControl sx={{ m: 1, width: 300 }}>
      <Select
          labelId="employee-select-label"
          id="employee-select"
          value={practitioner.employeeId}
          label="Practitioners"
          onChange={e => setPractitioner({ ...practitioner, employeeId: e.target.value })}
          style={{textAlign:'left'}}
        >
          {practitioners.map(prac => (
            <MenuItem key={prac.EmployeeID} value={prac.EmployeeID}>{prac.FirstName}</MenuItem>
          ))}
      </Select>
    </FormControl>
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "10px" }}>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={1}
          skipMonths={1}
          onTimeRangeSelected={(args) => {
            calendarRef.current.control.update({
              startDate: args.day,
            });
          }}
        />
      </div>
      <div style={{ flexGrow: "1" }}>
        <DayPilotCalendar {...calendarConfig} ref={calendarRef} />
      </div>
    </div>
    </>
  );
};

export default Calendar;
