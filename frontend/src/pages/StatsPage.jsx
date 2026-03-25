import { useEffect, useState } from 'react';
import { getStats } from '../api/searchApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch {
        setError('Could not fetch stats.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2>Statistics</h2>

      {/* Top 3 cities */}
      <h3>Top 3 Most Searched Cities</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.topCities}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#e67e22" />
        </BarChart>
      </ResponsiveContainer>

      {/* Condition distribution */}
      <h3>Weather Condition Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.conditionDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="condition" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2980b9" />
        </BarChart>
      </ResponsiveContainer>

      {/* Recent searches */}
      <h3>Last 3 Searches</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>City</th>
            <th>Condition</th>
            <th>Temperature (°C)</th>
            <th>Searched At</th>
          </tr>
        </thead>
        <tbody>
          {stats.recentSearches.map((item) => (
            <tr key={item.id}>
              <td>{item.city}</td>
              <td>{item.weatherCondition}</td>
              <td>{Math.round(item.temperatureC)}</td>
              <td>{new Date(item.searchedAt).toLocaleString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
