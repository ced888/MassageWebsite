import React, {useState, useEffect, useReducer} from 'react';
import './booking.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

function TimeslotComponent ({ startHour, endHour, duration, onHourSelect }) {
  //translate duration into time intervals in minutes
  let intervals = duration / 60;
  const timeslot = [];

  //add timeslot as long as massage does not exceed closing hours
  let counter = 1;
  for (let hour = startHour; hour + intervals < endHour; hour += intervals) {
    timeslot.push({hour: hour, value: counter++});
  }

  const displayTime = (hour, intervals) =>{
    var string = `${Math.floor(hour)}:` + `${(hour - Math.floor(hour)) * 60}`.padStart(2,"0") + ` - ` 
                + `${Math.floor(hour + intervals)}:`+`${(intervals - Math.floor(intervals)) * 60}`.padStart(2,"0") ;
    return string;
  }
  const [radioValue, setRadioValue] = React.useState('1');
  const [value, setValue] = React.useState();
  const handleChange = (val) => setValue(val);
  return (
    <div>
      Select a Timeslot:
      <br></br>
      <ToggleButtonGroup type="radio" name='timeslot' value={value} onChange={handleChange}>
      {timeslot.map((radio, idx) => (
          <ToggleButton 
          id={`radio-${idx}`} 
          className='pill' 
          key={radio.hour} 
          onClick={() => onHourSelect(`${Math.floor(radio.hour)}:` + `${(radio.hour - Math.floor(radio.hour)) * 60}`.padStart(2,"0"))} 
          value={radio.value}
          onChange={(e) => setRadioValue(e.currentTarget.value)}>
            {displayTime(radio.hour, intervals)}
          </ToggleButton>
        ))}
    </ToggleButtonGroup>
    </div>
  );
};

export default TimeslotComponent;