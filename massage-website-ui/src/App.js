import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import AppNavBar from './components/header';
import AppHero from './components/hero';
import AppServices from './components/services';
import Footer from './components/footer'

import AppDatePicker from './components/datepicker'


function App() {
  return (
    
    <div className="App">
      <header id="header">
        <AppNavBar />
      </header>

      <main>
        <AppHero />

        <AppServices />
        
        <AppDatePicker/>
      </main>
      <Footer />
    </div>
  );
}

export default App;
