import { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api/weatherApi';

const CACHE_KEY = 'weather_widget_cache';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
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
          localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
          setWeather(res.data);
        } catch {
          if (!weather) setError('Could not fetch weather');
        }
      },
      () => {
        if (!weather) setError('Location access denied');
      },
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
