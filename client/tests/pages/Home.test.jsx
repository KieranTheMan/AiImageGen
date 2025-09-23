import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../src/pages/Home';

// Mock the components
jest.mock('../../src/components', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
  Card: ({ _id, name, prompt, photo }) => (
    <div data-testid={`card-${_id}`}>
      <span>{name}</span>
      <span>{prompt}</span>
    </div>
  ),
  FormField: ({ value, handleChange, placeholder }) => (
    <input 
      data-testid="search-input"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}));

// Mock the assets
jest.mock('../../src/assets', () => ({
  title: 'mock-title-image.png'
}));

// Mock fetch
global.fetch = jest.fn();

describe('Home Component', () => {
  const mockPosts = [
    {
      _id: '1',
      name: 'Alice',
      prompt: 'A cat in space',
      photo: 'https://example.com/cat.jpg'
    },
    {
      _id: '2',
      name: 'Bob',
      prompt: 'A dog on Mars',
      photo: 'https://example.com/dog.jpg'
    }
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders title image', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<Home />);
    
    const titleImage = screen.getByRole('img');
    expect(titleImage).toHaveAttribute('src', 'mock-title-image.png');
  });

  test('shows loader while fetching posts', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(<Home />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('displays posts after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockPosts })
    });

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Home />);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  test('filters posts based on search input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockPosts })
    });

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'cat' } });

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText(/showing results for/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('shows "No posts found" when no data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });
});

