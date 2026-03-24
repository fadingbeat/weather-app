import { useEffect, useState } from 'react';
import { getSearchHistory } from '../api/searchApi';

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

  if (loading) return <p>Loading history...</p>;
  if (error) return <p>{error}</p>;
  if (history.length === 0) return <p>No searches yet.</p>;

  return (
    <div>
      <h2>Search History</h2>
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
          {history.map((item) => (
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
