import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

describe('ProtectedRoute Guard Edge Cases', () => {
  it('redirects unauthenticated guest users to /login', () => {
    // Mock useAuth returning unauthenticated state
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/library']}>
        <Routes>
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <div>Secret Personal Library</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page Target</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Secret Personal Library')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page Target')).toBeInTheDocument();
  });

  it('renders protected child component when user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/library']}>
        <Routes>
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <div>Secret Personal Library</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Personal Library')).toBeInTheDocument();
  });
});