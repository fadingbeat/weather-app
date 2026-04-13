import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';

export default function NavBar() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <nav className="flex items-center gap-1 flex-wrap pb-2 sm:pb-0">
      <NavLink to="/forecast" style={linkStyle}>
        Forecast
      </NavLink>
      <NavLink to="/history" style={linkStyle}>
        History
      </NavLink>
      <NavLink to="/stats" style={linkStyle}>
        Statistics
      </NavLink>

      <button
        onClick={toggleTheme}
        className="ml-1 p-2 rounded-lg border text-base transition-all duration-200"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {theme === 'dark' ? '☀️' : '🌧️'}
      </button>
      {user && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, </span>
          {user.email}
        </span>
      )}
      <button
        onClick={handleLogout}
        className="ml-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        Logout
      </button>
    </nav>
  );
}
