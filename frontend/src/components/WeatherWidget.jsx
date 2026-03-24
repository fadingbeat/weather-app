import { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api/weatherApi';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(
    !navigator.geolocation ? 'Geolocation not supported' : '',
  );

  useEffect(() => {
    if (error) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude,
          );
          setWeather(res.data);
        } catch {
          setError('Could not fetch weather');
        }
      },
      () => setError('Location access denied'),
    );
  }, []);

  if (error) return <div>{error}</div>;
  if (!weather) return <div>Loading weather...</div>;

  return (
    <div>
      <span>
        {weather.city}, {weather.country}
      </span>
      <span>{Math.round(weather.temperature)}°C</span>
      <span>{weather.condition}</span>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt={weather.condition}
      />
      <span>Humidity: {weather.humidity}%</span>
      <span>Wind: {weather.windSpeed} m/s</span>
    </div>
  );
}
