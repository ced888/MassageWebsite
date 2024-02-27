import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


import AppHero from '../components/hero';
import AppServices from '../components/services';

function Homepage() {

  return (
    <div className="App">
      <main>
        <AppHero />

        <AppServices />

      </main>
    </div>
  );
}

export default Homepage;
