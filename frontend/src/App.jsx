import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import LoadingSkeleton from './components/ui/LoadingSkeleton';

// Lazy-loaded route chunks for performance code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const UpcomingPage = lazy(() => import('./pages/UpcomingPage'));
const GenresPage = lazy(() => import('./pages/GenresPage'));
const LeaderboardsPage = lazy(() => import('./pages/LeaderboardsPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5-minute global cache
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Fallback loader for lazy chunks
const PageLoader = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-6">
    <div className="h-44 rounded-3xl bg-brand-card animate-pulse" />
    <LoadingSkeleton count={10} />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>

                {/* Main Application Layout */}
                <Route path="/" element={<AppLayout />}>

                  {/* Home */}
                  <Route index element={<HomePage />} />

                  {/* Public Pages */}
                  <Route
                    path="upcoming"
                    element={<UpcomingPage />}
                  />

                  <Route
                    path="genres"
                    element={<GenresPage />}
                  />

                  <Route
                    path="leaderboards"
                    element={<LeaderboardsPage />}
                  />

                  {/* Dynamic Detail Route */}
                  <Route
                    path="content/:id"
                    element={<DetailPage />}
                  />

                  {/* Public Auth Routes */}
                  <Route
                    path="login"
                    element={<LoginPage />}
                  />

                  <Route
                    path="register"
                    element={<RegisterPage />}
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

                  {/* 404 Catch-All */}
                  <Route
                    path="*"
                    element={<NotFoundPage />}
                  />

                </Route>

              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;