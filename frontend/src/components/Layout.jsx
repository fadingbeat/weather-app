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
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <WeatherWidget />
          <NavBar />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
