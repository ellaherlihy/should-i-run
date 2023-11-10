import React from "react";
import { BiSolidLeaf } from 'react-icons/bi';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { FaTemperatureQuarter } from 'react-icons/fa6';

const googleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;
const airQualityAPIKey = process.env.REACT_APP_AQ_API_KEY;

const weatherIcons = {
  "01d": "clear sky (day)",
  "04d": "broken clouds",
  "04n": "clear sky (night)",
  "02d": "few clouds (day)",
  "02n": "few clouds (night)",
  "03d": "scattered clouds",
  "09d": "rain showers",
  "10d": "rain (day time)",
  "10n": "rain (night time)",
  "11d": "thunderstorm",
  "13d": "snow",
  "50d": "mist",
}

export default function RunningFormForm() {
  const [formData, setFormData] = React.useState(
    {
      postcode: "",
    }
  )

  const [location, setLocation ] = React.useState(
    {
      lat: "",
      long: "",
      address: "",
    }
  )

  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [AQI, setAQI ] = React.useState(null)
  const [weather, setWeather ] = React.useState(null)
  const [temperature, setTemperature ] = React.useState(null)


  function handleChange(event) {
    const {name, value, type, checked} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value
      }
    })
  }

  async function fetchGoogleAPI(event) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.postcode}&key=${googleAPIKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        console.log(data)
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        const address = data.results[0].formatted_address
        setLocation({ lat: lat, long: lng, address: address });

      } else {
        console.error("Geocoding request failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    airQualityApi()
  }

  async function airQualityApi() {
    try {
      const secondResponse = await fetch(
        `https://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=-${location.long}&key=${airQualityAPIKey}`
        );
      const secondData = await secondResponse.json();
      console.log(secondData)
      setAQI(secondData.data.current.pollution.aqius)
      setWeather(secondData.data.current.weather.ic)
      setTemperature(secondData.data.current.weather.tp)

    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    fetchGoogleAPI()
    setFormSubmitted(true)
  }

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div>
      {!formSubmitted && (
        <form onSubmit={handleSubmit}>
          <h1>Should I go for a run?</h1>
          <label htmlFor="duration">Where do you want to run?</label>
          <br />
          <input
            type="text"
            placeholder="Enter postcode"
            onChange={handleChange}
            name="postcode"
            value={formData.postcode}
          />
          <button>help me decide 🏃‍♀️</button>
        </form>
      )}
        {formSubmitted && (
          <div className="results">
            <div className="results--section">
              <p><div className="logo"><BiSolidLeaf /></div></p>
              <p>The air quality in {location.address} is currently {AQI <= 50 ? "good" : "bad"}</p>
            </div>
            <div className="results--section">
              <p><div className="logo"><TiWeatherPartlySunny /></div></p>
              <p>The weather forecast is {weatherIcons[weather]}</p>
            </div>
            <div className="results--section">
              <p><div className="logo"><FaTemperatureQuarter /></div></p>
              <p>The temperature is {temperature} degrees</p>
            </div>
            <button onClick={refreshPage}>Check out somewhere else!</button>
          </div>
        )}
    </div>
  )
}
