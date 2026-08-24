import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CastGrid from './CastGrid';

describe('CastGrid Component Edge Cases', () => {
  it('renders a clean fallback message when cast list is empty', () => {
    render(<CastGrid castCredits={[]} />);
    expect(screen.getByText(/no cast information registered/i)).toBeInTheDocument();
  });

  it('renders cast member cards with character names correctly', () => {
    const mockCast = [
      {
        id: 1,
        character_name: 'Cooper',
        person: { id: 10, name: 'Matthew McConaughey', profile_path: null },
      },
    ];

    render(<CastGrid castCredits={mockCast} />);
    expect(screen.getByText('Matthew McConaughey')).toBeInTheDocument();
    expect(screen.getByText('as Cooper')).toBeInTheDocument();
  });

  it('renders "Self" when character_name is null', () => {
    const mockCast = [
      {
        id: 2,
        character_name: null,
        person: { id: 11, name: 'Christopher Nolan', profile_path: null },
      },
    ];

    render(<CastGrid castCredits={mockCast} />);
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('Self')).toBeInTheDocument();
  });
});