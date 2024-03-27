import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval, addDays } from 'date-fns';


let shiftIdCounter = 2;

function EmployeeScheduler() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([
    { id: 1, employeeId: 1, date: '2023-04-03', start: '09:00', end: '17:00' },
  ]);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const [newShift, setNewShift] = useState({
    employeeId: '',
    date: '',
    start: '',
    end: ''
  });

  useEffect (()=>{
    axios.get(`/employees/prac`)
    .then((res)=>{
      console.log(res);
      if(res.data !== "")
        setEmployees(res.data);
    })
  }, []);

  

  const handleWeekChange = (direction) => {
    setCurrentWeek(current => addWeeks(current, direction === 'next' ? 1 : -1));
  };

  const handleAddShift = () => {
    if (!newShift.employeeId || !newShift.date || !newShift.start || !newShift.end) {
      alert('Please fill in all fields to add a shift.');
      return;
    }
    if(shifts.find(s => s.employeeId === newShift.employeeId && s.date === newShift.date)){
        alert('Please only one shift per date.');
      return;
    }
    const newShiftToAdd = { ...newShift, id: ++shiftIdCounter };
    setShifts(currentShifts => [...currentShifts, newShiftToAdd]);
    setNewShift({ employeeId: newShift.employeeId, date: newShift.date, start: newShift.start, end: newShift.end });
  };

  const handleRemoveShift = (id) => {
    setShifts(currentShifts => currentShifts.filter(shift => shift.id !== id));
  };

  const handleSaveShifts = (id) => {
    console.log(shifts);
  };

  const weekDays = eachDayOfInterval({
    start: currentWeek,
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  }).map(day => format(day, 'yyyy-MM-dd'));

  // const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  // const daysOfWeek = Array.from({ length: 7 }).map((_, i) => format(addDays(startOfCurrentWeek, i), 'yyyy-MM-dd'));

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <div style={{ width:'40%' }}>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel id="employee-select-label">Employee</InputLabel>
          <Select
            labelId="employee-select-label"
            id="employee-select"
            value={newShift.employeeId}
            label="Employee"
            onChange={e => setNewShift({ ...newShift, employeeId: e.target.value })}
            style={{textAlign:'left'}}
          >
            {employees.map(employee => (
              <MenuItem key={employee.EmployeeID} value={employee.EmployeeID}>{employee.FirstName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={newShift.date}
          onChange={e => setNewShift({ ...newShift, date: e.target.value })}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          type="time"
          label="Start Time"
          InputLabelProps={{ shrink: true }}
          value={newShift.start}
          onChange={e => setNewShift({ ...newShift, start: e.target.value })}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          type="time"
          label="End Time"
          InputLabelProps={{ shrink: true }}
          value={newShift.end}
          onChange={e => setNewShift({ ...newShift, end: e.target.value })}
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={handleAddShift} variant="contained" style={{ marginRight: '10px' }}>Add Shift</Button>
        <Button onClick={handleSaveShifts} variant="contained">Save Shift</Button>
      </div>
      
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">Employee</TableCell>
              {weekDays.map(day => (
                <TableCell key={day}>{format(addDays(day, 1), 'ccc, MMM dd')}</TableCell>
                //<TableCell key={day}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(employee => (
              <TableRow key={employee.EmployeeID}>
                <TableCell component="th" scope="row">{employee.FirstName}</TableCell>
                {weekDays.map(day => (
                  <TableCell key={day}>
                    {shifts.filter(shift => shift.employeeId === employee.EmployeeID && shift.date === day)
                      .map(shift => (
                        <div key={shift.id} style={{backgroundColor:'lightgreen', padding:'10px', borderRadius:'5px'}}>
                          {`${shift.start} - ${shift.end}`}
                          <IconButton style={{color:'#e9486f', textAlign:'left'}} onClick={() => handleRemoveShift(shift.id)} size="small">
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </div>
                      ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '20px', textAlign:'right' }}>
        <Button onClick={() => handleWeekChange('prev')} variant="outlined" style={{ marginRight: '10px' }}>Previous Week</Button>
        <Button onClick={() => handleWeekChange('next')} variant="outlined">Next Week</Button>
      </div>
    </Paper>
  );
};

export default EmployeeScheduler;
