import { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api/weatherApi';

const CACHE_KEY = 'weather_widget_cache';

const weatherIconMap = {
  Thunderstorm: '⛈️',
  Drizzle: '🌦️',
  Rain: '🌧️',
  Snow: '❄️',
  Clear: '☀️',
  Clouds: '☁️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
};

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

  const icon = weatherIconMap[weather.condition] ?? '🌡️';

  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl leading-none">{icon}</span>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {weather.city}, {weather.country}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>
            {Math.round(weather.temperature)}°C
          </span>
          <span className="mx-1.5" style={{ color: 'var(--border)' }}>
            ·
          </span>
          {weather.condition}
          <span className="mx-1.5" style={{ color: 'var(--border)' }}>
            ·
          </span>
          {weather.humidity}% humidity
        </p>
      </div>
    </div>
  );
}
