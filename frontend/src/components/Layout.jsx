import WeatherWidget from './WeatherWidget';
import NavBar from './NavBar';

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <WeatherWidget />
          <NavBar />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-8">{children}</main>
    </div>
  );
}
