import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import GenresPage from './pages/GenresPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LibraryPage from './pages/LibraryPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

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
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>

              {/* Main Application Layout */}
              <Route path="/" element={<AppLayout />}>

                {/* Home */}
                <Route index element={<HomePage />} />

                {/* Public Pages */}
                <Route path="upcoming" element={<UpcomingPage />} />
                <Route path="genres" element={<GenresPage />} />
                <Route
                  path="leaderboards"
                  element={<LeaderboardsPage />}
                />

                {/* Dynamic Detail Page */}
                <Route
                  path="content/:id"
                  element={<DetailPage />}
                />

                {/* Protected Personal Library */}
                <Route
                  path="library"
                  element={
                    <ProtectedRoute>
                      <LibraryPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;