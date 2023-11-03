import React from 'react';

const googleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;
const airQualityAPIKey = process.env.REACT_APP_AQ_API_KEY;

export default function RunningFormForm() {
  const [formData, setFormData] = React.useState(
    {
      address: "",
      duration: ""
    }
  )

  const [location, setLocation ] = React.useState(
    {
      lat: "",
      long: ""
    }
  )

    function handleChange(event) {
      const {name, value, type, checked} = event.target
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          [name]: type === "checkbox" ? checked : value
        }
      })
    }

    async function handleSubmit(event) {
      event.preventDefault();

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${googleAPIKey}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          const lat = data.results[0].geometry.location.lat;
          const lng = data.results[0].geometry.location.lng;
          setLocation({ lat: lat, long: lng });
          console.log("trying AQ API")

        } else {
          console.error("Geocoding request failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      return location
      // airQualityApi()
    }

    async function airQualityApi() {
      try {
        const secondResponse = await fetch(
          `http://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=-${location.long}&key=${airQualityAPIKey}`
        );
        const secondData = await secondResponse.json();
        console.log(location.lat)
        console.log(location.long)
        console.log(secondData)

      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    // airQualityApi()

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
        <label htmlFor="duration">How long for?</label>
        <br />
        <select
          id="duration"
          value={formData.duration}
          onChange={handleChange}
          name="duration"
        >
          <option value="">Select a length of time</option>
          <option value="<30mins">Less than 30mins</option>
          <option value="30-60mins">30-60mins</option>
          <option value="<1hr">1 hour+</option>
        </select>
        <br />
        <br />
        <button>Submit</button>
        <p>Current Location: {location.lat}, {location.long}</p>

    </form>
  )
}
