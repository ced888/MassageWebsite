import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import AppNavBar from './components/header';
import AppHero from './components/hero';
import AppServices from './components/services';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function App() {
  return (
    
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <header id="header">
        <AppNavBar />
      </header>

      <main>
        <AppHero />

        <AppServices />
        
        <DatePicker/>
      </main>
      </LocalizationProvider>
    </div>
  );
}

export default App;
