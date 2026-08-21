import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import GenresPage from './pages/GenresPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LibraryPage from './pages/LibraryPage';
import DetailPage from './pages/DetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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
            {/* Dynamic Content Detail Route */}
            <Route path="content/:id" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;