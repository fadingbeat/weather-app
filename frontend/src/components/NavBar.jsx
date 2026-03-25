import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';

export default function NavBar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center gap-2">
      <NavLink
        to="/forecast"
        style={({ isActive }) => ({
          fontSize: '14px',
          fontWeight: '500',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '6px',
          transition: 'color 0.2s ease',
        })}
      >
        Forecast
      </NavLink>
      <NavLink
        to="/history"
        style={({ isActive }) => ({
          fontSize: '14px',
          fontWeight: '500',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '6px',
          transition: 'color 0.2s ease',
        })}
      >
        History
      </NavLink>
      <NavLink
        to="/stats"
        style={({ isActive }) => ({
          fontSize: '14px',
          fontWeight: '500',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '6px',
          transition: 'color 0.2s ease',
        })}
      >
        Statistics
      </NavLink>

      <button
        onClick={toggleTheme}
        className="ml-2 p-2 rounded-lg border text-base transition-all duration-200 hover:border-accent"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {theme === 'dark' ? '☀️' : '🌧️'}
      </button>

      <button
        onClick={handleLogout}
        className="ml-1 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        Logout
      </button>
    </nav>
  );
}
