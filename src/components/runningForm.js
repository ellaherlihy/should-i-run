import React, { useEffect } from "react";

const googleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;
const airQualityAPIKey = process.env.REACT_APP_AQ_API_KEY;

const weatherIcons = {
  "01d": "clear sky (day)",
  "04d": "broken clouds",
  "01n": "clear sky (night)",
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
      address: "",
    }
  )

  const [location, setLocation ] = React.useState(
    {
      lat: "",
      long: ""
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
          `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${googleAPIKey}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          console.log(data)
          const lat = data.results[0].geometry.location.lat;
          const lng = data.results[0].geometry.location.lng;
          setLocation({ lat: lat, long: lng });

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
          `http://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=-${location.long}&key=${airQualityAPIKey}`
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

    useEffect(() => {
    }, [formData])

    const handleSubmit = e => {
      e.preventDefault()
      fetchGoogleAPI()
      setFormSubmitted(true)
    }

    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="duration">Where do you want to run?</label>
        <br />
        <input
          type="text"
          placeholder="Enter postcode"
          onChange={handleChange}
          name="address"
          value={formData.address}
        />
        <button>Submit</button>
        {formSubmitted && (
        <div>
          <p>The air quality is currently {AQI <= 50 ? "good" : "bad"}</p>
          <p>The weather forecast is {weatherIcons[weather]}</p>
          <p>The temperature is {temperature} degrees</p>
        </div>
      )}
    </form>
  )
}
