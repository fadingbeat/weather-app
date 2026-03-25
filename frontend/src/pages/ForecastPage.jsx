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

export default function ForecastPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setQuery(`${city.name}`);
    setSuggestions([]);
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
    <div>
      <h2>Forecast</h2>

      {/* City search */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              border: '1px solid #ccc',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              width: '100%',
              zIndex: 10,
            }}
          >
            {suggestions.map((city, i) => (
              <li
                key={i}
                onClick={() => handleSelectCity(city)}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                {city.name}
                {city.state ? `, ${city.state}` : ''}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Days filter */}
      <div style={{ marginTop: '16px' }}>
        <span>Show: </span>
        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              fontWeight: days === d ? 'bold' : 'normal',
              marginRight: '8px',
            }}
          >
            {d} {d === 1 ? 'day' : 'days'}
          </button>
        ))}
      </div>

      {loading && <p>Loading forecast...</p>}
      {error && <p>{error}</p>}

      {filteredData.length > 0 && (
        <>
          {/* Chart */}
          <div style={{ marginTop: '24px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#e67e22"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Humidity"
                  stroke="#2980b9"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grid */}
          <table
            style={{
              width: '100%',
              marginTop: '24px',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Condition</th>
                <th>Temp (°C)</th>
                <th>Humidity (%)</th>
                <th>Wind (m/s)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i}>
                  <td>{new Date(item.dateTime).toLocaleString('en-GB')}</td>
                  <td>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                      alt={item.condition}
                      width={30}
                    />
                    {item.condition}
                  </td>
                  <td>{Math.round(item.temperature)}</td>
                  <td>{item.humidity}</td>
                  <td>{item.windSpeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
