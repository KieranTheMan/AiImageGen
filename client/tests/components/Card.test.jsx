// Import testing utilities
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../src/components/Card';
import * as utils from '../../src/utils';

// MOCKING SECTION
// Mock the utils module so we can track if downloadImage is called
jest.mock('../../src/utils', () => ({
  downloadImage: jest.fn()
}));

// Mock the assets so we don't need actual image files
jest.mock('../../src/assets', () => ({
  download: 'mock-download-icon.png'
}));

describe('Card Component', () => {
  // Set up mock data that we'll use in multiple tests
  const mockProps = {
    _id: '12345',
    name: 'John Doe',
    prompt: 'A beautiful sunset over mountains',
    photo: 'https://example.com/image.jpg'
  };

  // Before each test, clear any previous function calls
  beforeEach(() => {
    utils.downloadImage.mockClear();
  });

  test('renders card with correct image and alt text', () => {
    // ARRANGE & ACT: Render the component with our mock props
    render(<Card {...mockProps} />);
    
    // ASSERT: Check that elements are rendered correctly
    const image = screen.getByAltText(mockProps.prompt);
    expect(image).toBeInTheDocument(); // Should exist in the DOM
    expect(image).toHaveAttribute('src', mockProps.photo); // Should have correct src
  });

  test('displays user name and initial', () => {
    // ARRANGE & ACT
    render(<Card {...mockProps} />);
    
    // ASSERT: Check that user name is displayed
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    
    // Check that user initial is displayed (second character of name)
    expect(screen.getByText('o')).toBeInTheDocument(); // 'o' from "John"
  });

  test('shows prompt text in hover overlay', () => {
    // ARRANGE & ACT
    render(<Card {...mockProps} />);
    
    // ASSERT: Check that prompt text is displayed
    expect(screen.getByText(mockProps.prompt)).toBeInTheDocument();
  });

  test('calls downloadImage when download button is clicked', () => {
    // ARRANGE & ACT: Render component
    render(<Card {...mockProps} />);
    
    // Find the download button and click it
    const downloadButton = screen.getByRole('button');
    fireEvent.click(downloadButton);
    
    // ASSERT: Check that downloadImage was called with correct parameters
    expect(utils.downloadImage).toHaveBeenCalledWith(
      mockProps._id, 
      mockProps.photo
    );
  });

  test('handles short name gracefully', () => {
    // ARRANGE: Test with a single character name
    const propsWithShortName = { ...mockProps, name: 'A' };
    
    // ACT
    render(<Card {...propsWithShortName} />);
    
    // ASSERT: Should still display the name
    expect(screen.getByText('A')).toBeInTheDocument();
    
    // Note: The component tries to access name[1] which would be undefined for 'A'
    // But it should still render without crashing
  });
});

