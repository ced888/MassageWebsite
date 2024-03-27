import React, {useEffect, useState, useReducer} from "react";
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";

//Fetch available practitioners here

//function PractitionerComponent({onChange, duration, sel_date, time}){
function PractitionerComponent({onChange, practitioners}){
    let prac = practitioners;

    const handleChanges = (val) => {
        console.log(val.target.value);
    };
    
    if(prac.length != practitioners.length){
        return <>Loading</>
    }

    return (
    <>
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