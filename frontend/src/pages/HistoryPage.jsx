import { useEffect, useState } from 'react';
import { getSearchHistory } from '../api/searchApi';

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

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSearchHistory();
        setHistory(res.data);
      } catch {
        setError('Could not fetch history.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Loading history...
      </p>
    );
  if (error)
    return (
      <p className="text-sm" style={{ color: 'var(--danger)' }}>
        {error}
      </p>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Search History
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          All your previous city searches
        </p>
      </div>

      {history.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <span className="text-4xl">🔍</span>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            No searches yet. Go to Forecast and search a city.
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <table className="w-full text-sm">
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
              {history.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom:
                      i < history.length - 1
                        ? '1px solid var(--border)'
                        : 'none',
                    backgroundColor:
                      i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <td
                    className="px-6 py-3 font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.city}
                  </td>
                  <td className="px-6 py-3">
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
                    className="px-6 py-3 font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {Math.round(item.temperatureC)}°C
                  </td>
                  <td
                    className="px-6 py-3"
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
      )}
    </div>
  );
}
