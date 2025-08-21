import { useState, useEffect } from "react";
import "./Weather.css"; 
import sunIcon from "../../../public/sun.png"

export default function CurrentWeather({ city }) {
  const [weather, setWeather] = useState(null);
  const apiKey = "eb6fd71c4a05488d84e14920240911"; 

  useEffect(() => {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=95403`)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error(err));
  }, [city]);

  if (!weather) return <p>Loading weather...</p>;
  if (weather.error) return <p>Error: {weather.error.message}</p>;

  return (
    <div className="weather-container">
      <img
        className="weather-icon"
        src={sunIcon}
        alt="Sun"
      />
      <p className="weather-temp">{weather.current.temp_f}°F</p>
    </div>
  );
}
