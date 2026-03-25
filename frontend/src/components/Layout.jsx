import { NavLink } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <WeatherWidget />
        <nav>
          <NavLink to="/forecast">Forecast</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/stats">Statistic</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
