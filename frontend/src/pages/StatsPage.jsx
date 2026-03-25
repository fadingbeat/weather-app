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
  Cell,
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
        <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <p style={{ color: 'var(--accent)' }}>
          Searches: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

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

  if (loading)
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Loading statistics...
      </p>
    );
  if (error)
    return (
      <p className="text-sm" style={{ color: 'var(--danger)' }}>
        {error}
      </p>
    );
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Statistics
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Insights from your search history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 3 cities */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Top 3 Most Searched
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.topCities} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="city"
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stats.topCities.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0 ? '#F5A623' : i === 1 ? '#F5A62399' : '#F5A62366'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition distribution */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Condition Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.conditionDistribution} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="condition"
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${weatherIconMap[val] ?? '🌡️'} ${val}`}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="count" fill="#60A5FA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last 3 searches */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Last 3 Searches
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['City', 'Condition', 'Temp', 'Searched At'].map((h) => (
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
              {stats.recentSearches.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom:
                      i < stats.recentSearches.length - 1
                        ? '1px solid var(--border)'
                        : 'none',
                  }}
                >
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.city}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {weatherIconMap[item.weatherCondition] ?? '🌡️'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.weatherCondition}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {Math.round(item.temperatureC)}°C
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date(item.searchedAt).toLocaleString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
