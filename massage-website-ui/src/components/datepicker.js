import React from "react";

import { DatePicker , LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function datepickerComponent(){
    return(
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DatePicker />
            </LocalizationProvider>
        </div>
        
    )
}

export default datepickerComponent;