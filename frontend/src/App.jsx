import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import GenresPage from './pages/GenresPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LibraryPage from './pages/LibraryPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { useAuth } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protect routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until authentication status is determined
  if (isLoading) {
    return null;
  }

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, so allow access
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Application Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />

            <Route path="upcoming" element={<UpcomingPage />} />

            <Route path="genres" element={<GenresPage />} />

            <Route
              path="leaderboards"
              element={<LeaderboardsPage />}
            />

            {/* Protected Library Route */}
            <Route
              path="library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />

            {/* Dynamic Content Detail Route */}
            <Route
              path="content/:id"
              element={<DetailPage />}
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;