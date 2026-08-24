import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WatchProviders from './WatchProviders';

describe('WatchProviders Component Edge Cases', () => {
  it('renders fallback notice when watchProviders is null or empty', () => {
    render(<WatchProviders watchProviders={null} />);
    expect(
      screen.getByText(/currently not available on major digital subscription streaming platforms/i)
    ).toBeInTheDocument();
  });

  it('renders streaming provider badges and direct watch link when available', () => {
    const mockProviders = {
      watch_link: 'https://netflix.com/title/12345',
      providers: [
        { provider_id: 8, name: 'Netflix', logo_path: null },
      ],
    };

    render(<WatchProviders watchProviders={mockProviders} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    const linkElement = screen.getByRole('link', { name: /watch on platform/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://netflix.com/title/12345');
  });
});