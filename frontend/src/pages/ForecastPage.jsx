import { useState, useEffect, useRef } from 'react';
import { searchCities, getForecast } from '../api/weatherApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 border text-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <p
          className="font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}:{' '}
            <span className="font-semibold">
              {entry.value}
              {entry.name === 'Temperature' ? '°C' : '%'}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setQuery(`${city.name}`);
    setSuggestions([]);
    setCityName(city.name);
    setError('');
    setLoading(true);
    try {
      const res = await getForecast(city.name);
      setForecastData(res.data.items);
    } catch {
      setError('Could not fetch forecast.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity && query === selectedCity.name) return;
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchCities(query);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [query, selectedCity]);

  const filteredData = forecastData.filter((item) => {
    const itemDate = new Date(item.dateTime);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    return itemDate <= cutoff;
  });

  const chartData = filteredData.map((item) => ({
    time: new Date(item.dateTime).toLocaleDateString('en-GB', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    Temperature: Math.round(item.temperature),
    Humidity: item.humidity,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Forecast
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Search a Croatian city to see the 5-day forecast
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm border transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          {suggestions.length > 0 && (
            <ul
              className="absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 shadow-xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              {suggestions.map((city, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectCity(city)}
                  className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'var(--bg-secondary)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {city.name}
                  {city.state ? `, ${city.state}` : ''}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="flex items-center gap-1 rounded-xl p-1 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: days === d ? 'var(--accent)' : 'transparent',
                color: days === d ? '#0F1117' : 'var(--text-secondary)',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading forecast...
        </p>
      )}
      {error && (
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}

      {filteredData.length > 0 && (
        <>
          {cityName && (
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {cityName}
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                }}
              >
                {filteredData.length} entries
              </span>
            </div>
          )}

          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
          >
            <h4
              className="text-sm font-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Temperature & Humidity
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#F5A623"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Humidity"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-150">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {[
                      'Date & Time',
                      'Condition',
                      'Temp',
                      'Humidity',
                      'Wind',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < filteredData.length - 1
                            ? '1px solid var(--border)'
                            : 'none',
                        backgroundColor:
                          i % 2 === 0
                            ? 'transparent'
                            : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <td
                        className="px-6 py-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {new Date(item.dateTime).toLocaleString('en-GB', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {weatherIconMap[item.condition] ?? '🌡️'}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>
                            {item.condition}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-3 font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {Math.round(item.temperature)}°C
                      </td>
                      <td
                        className="px-6 py-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.humidity}%
                      </td>
                      <td
                        className="px-6 py-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.windSpeed} m/s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
