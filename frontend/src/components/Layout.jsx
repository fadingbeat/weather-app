import WeatherWidget from './WeatherWidget';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <WeatherWidget />
      </header>
      <main>{children}</main>
    </div>
  );
}
