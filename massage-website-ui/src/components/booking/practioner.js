import React from "react";
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/material/Typography';
import { Container, TableRow } from "@mui/material";


//Fetch available practitioners here

function PractitionerComponent({onChange}){

    const handleChanges = (val) => {
        console.log(val.target.value);
    };

    const practitioners = [
        {name:"Erin", id:"1"},
        {name:"Aaron", id:"2"},
        {name:"Marissa", id:"3"}
    ];

    return (
    <RadioGroup
        overlay
        row
        name="member"
        orientation="horizontal"
        sx={{ gap: 2, 
            display: "flex", 
            justifyContent: "center"}}
        //onChange={handleChanges}
        onChange={onChange}
      >
        {practitioners.map((prac) => (
            <Sheet
                component="label"
                key={prac.id}
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
                value={`${prac.id}`}
                variant="soft"
                sx={{
                    mb: 2,
                }}
                />
                <Avatar alt={`Practitioner ${prac.id}`} src={require(`../../assets/img/profile/practitioner-${prac.id}.jpg`)} sx={{ height: 100, width:100 }}/>
                <Typography level="body-sm" sx={{mt:1}}>
                    Practitioner {prac.name}
                </Typography>
            </Sheet>
            ))}

      </RadioGroup>
    )
}

export default PractitionerComponent;