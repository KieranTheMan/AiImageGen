// Import testing utilities
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

describe('App Integration', () => {
  test('renders children correctly', () => {
    // ARRANGE: Create a test child component
    const TestChild = () => <div>Test Child Component</div>;
    
    // ACT: Render App with child component
    render(
      <App>
        <TestChild />
      </App>
    );
    
    // ASSERT: Check that child component is rendered
    expect(screen.getByText('Test Child Component')).toBeInTheDocument();
  });

  test('renders without crashing when no children provided', () => {
    // ARRANGE & ACT: Render App without children
    render(<App />);
    
    // ASSERT: Should render the div container without crashing
    expect(document.querySelector('div')).toBeInTheDocument();
  });
});

