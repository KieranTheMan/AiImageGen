// Import testing utilities
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from '../../src/components/Loader';

describe('Loader Component', () => {
  test('renders loading spinner with correct role', () => {
    // ARRANGE & ACT: Render the component
    render(<Loader />);
    
    // ASSERT: Check that loader has correct accessibility role
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  test('contains SVG element with correct classes', () => {
    // ARRANGE & ACT: Render the component
    render(<Loader />);
    
    // ASSERT: Check that SVG has correct styling classes
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin'); // Should have spinning animation
    expect(svg).toHaveClass('fill-[#6469ff]'); // Should have correct color
  });

  test('has proper accessibility attributes', () => {
    // ARRANGE & ACT: Render the component
    render(<Loader />);
    
    // ASSERT: Check accessibility attributes
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true'); // Hidden from screen readers
  });
});

