import './App.css';
import './styling/form.css'

import React, { useState, useEffect } from 'react';
import RunningForm from './components/runningForm';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          setError(err.message);
        }
        );
      } else {
        setError("Geolocation is not available in your browser.");
      }
  }, []);

  return (
    <div className="App">
      <RunningForm />
      <h1>hello</h1>
    </div>
  );
}

export default App;
