import { useState, useEffect } from 'react';

function App() {
  // Store the message coming from the Python backend
  const [apiStatus, setApiStatus] = useState('Connecting to backend...');
  const [isError, setIsError] = useState(false);

  // useEffect runs automatically when the page loads in the browser
  useEffect(() => {
    // Send an HTTP request to the Python FastAPI backend
    fetch('http://127.0.0.1:8000/api/v1/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then((data) => {
        // Update state with backend response
        setApiStatus(data.data);
        setIsError(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setApiStatus('Failed to connect to Python backend');
        setIsError(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col justify-between p-8">
      {/* Header Navigation Bar */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-brand-accent tracking-wider">
          CINEVERSE
        </h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#upcoming" className="hover:text-brand-accent transition-colors">Upcoming</a>
          <a href="#genres" className="hover:text-brand-accent transition-colors">Genres</a>
          <a href="#top-rated" className="hover:text-brand-accent transition-colors">Top IMDb</a>
          <a href="#personal" className="hover:text-brand-accent transition-colors">My Library</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full text-center py-20">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight">
          Discover Movies, Series & Sitcoms
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Track release schedules, explore genres, check IMDb rankings, and locate direct streaming links.
        </p>

        {/* Live Backend Communication Indicator */}
        <div className="inline-block p-6 rounded-xl bg-brand-card border border-gray-800 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
            System Status
          </p>
          <div className="flex items-center justify-center space-x-3">
            <span className={`h-3 w-3 rounded-full ${isError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
            <span className="text-md font-mono">{apiStatus}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-600 py-6 border-t border-gray-800">
        Entertainment Hub Platform &bull; Built with FastAPI & React
      </footer>
    </div>
  );
}

export default App;