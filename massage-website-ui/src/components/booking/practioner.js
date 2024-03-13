import React, {useEffect, useState, useReducer} from "react";
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";

//Fetch available practitioners here

function PractitionerComponent({onChange, duration, sel_date, time}){
    const [prac, setPracs] = useState([]);
    sel_date = sel_date.format('YYYY-MM-DD');
    console.log("/getavailprac/" + sel_date +" " + time + ":00/" + duration);

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
        async function fetchData(){
            //fetch("/getavailprac/" + sel_date +" " + time + ":00/" + duration)
            const res = await fetch(`/getavailprac/${sel_date} ${time}:00/${duration}`);
            res
            .json()
            .then(res => {setPracs(res); console.log(res)})
            .catch(err => console.log("Error", err));
        }
        fetchData();
    },[ignored]);
    console.log(prac);
    // if (prac.length == 0) return <h1>No Practitioners for this timeslot</h1>
    
    const handleChanges = (val) => {
        console.log(val.target.value);
    };
    
    return (
    <>
    <Button onClick={forceUpdate}>Refresh</Button>
    <RadioGroup
    //overlay
        row
        name="member"
        orientation="horizontal"
        sx={{ gap: 2, 
            display: "flex", 
            justifyContent: "center"}}
        //onChange={handleChanges}
        onChange={onChange}
      >
        {prac.map((prac) => (
            <Sheet
                component="label"
                key={prac.EmployeeID}
                variant="outlined"
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 'sm',
                borderRadius: 'md',
                width: 200
                }}
            >
                <Radio
                value={`${prac.EmployeeID}`}
                variant="soft"
                sx={{
                    mb: 2,
                }}
                />
                <Avatar alt={`Practitioner ${prac.EmployeeID}`} src={require(`../../assets/img/profile/practitioner-${prac.EmployeeID}.jpg`)} sx={{ height: 100, width:100 }}/>
                <Typography level="body-sm" sx={{mt:1}}>
                    Practitioner {prac.FirstName} {prac.LastName}
                </Typography>
            </Sheet>
            ))}

      </RadioGroup>
      </>
    )
}

export default PractitionerComponent;