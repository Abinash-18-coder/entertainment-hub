import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import GenresPage from './pages/GenresPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LibraryPage from './pages/LibraryPage';

// Initialize TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents excessive backend queries
      retry: 1, // Retry failed queries once before showing error UI
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="upcoming" element={<UpcomingPage />} />
            <Route path="genres" element={<GenresPage />} />
            <Route path="leaderboards" element={<LeaderboardsPage />} />
            <Route path="library" element={<LibraryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;