import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ForecastPage from './pages/ForecastPage';
import { useAuth } from './context/useAuth';
import HistoryPage from './pages/HistoryPage';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/forecast"
        element={
          <ProtectedRoute>
            <Layout>
              <LogoutButton />
              <ForecastPage />
              <HistoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/forecast" replace />} />
    </Routes>
  );
}
