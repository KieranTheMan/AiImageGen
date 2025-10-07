// Import testing utilities
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '../../src/components/FormField';

describe('FormField Component', () => {
  // Set up default props that we'll use in most tests
  const defaultProps = {
    labelName: 'Test Label',
    type: 'text',
    name: 'testField',
    placeholder: 'Enter text here',
    value: '',
    handleChange: jest.fn(), // Mock function to track calls
    isSurpriseMe: false,
    handleSurpriseMe: jest.fn() // Mock function to track calls
  };

  // Before each test, clear any previous function calls
  beforeEach(() => {
    defaultProps.handleChange.mockClear();
    defaultProps.handleSurpriseMe.mockClear();
  });

  test('renders form field with correct label and input', () => {
    // ARRANGE & ACT: Render component
    render(<FormField {...defaultProps} />);
    
    // ASSERT: Check that label and input are rendered
    expect(screen.getByLabelText(defaultProps.labelName)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(defaultProps.placeholder)).toBeInTheDocument();
  });

  test('displays current value in input', () => {
    // ARRANGE: Create props with a value
    const propsWithValue = { ...defaultProps, value: 'test value' };
    
    // ACT: Render component
    render(<FormField {...propsWithValue} />);
    
    // ASSERT: Check that the value is displayed
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  test('calls handleChange when input value changes', () => {
    // ARRANGE & ACT: Render component
    render(<FormField {...defaultProps} />);
    
    // Find the input and change its value
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    // ASSERT: Check that handleChange was called
    expect(defaultProps.handleChange).toHaveBeenCalled();
  });

  test('shows Surprise Me button when isSurpriseMe is true', () => {
    // ARRANGE: Create props with isSurpriseMe enabled
    const propsWithSurprise = { ...defaultProps, isSurpriseMe: true };
    
    // ACT: Render component
    render(<FormField {...propsWithSurprise} />);
    
    // ASSERT: Check that Surprise Me button is shown
    const surpriseButton = screen.getByText('Surprise Me');
    expect(surpriseButton).toBeInTheDocument();
  });

  test('does not show Surprise Me button when isSurpriseMe is false', () => {
    // ARRANGE & ACT: Render component with isSurpriseMe false
    render(<FormField {...defaultProps} />);
    
    // ASSERT: Check that Surprise Me button is NOT shown
    const surpriseButton = screen.queryByText('Surprise Me');
    expect(surpriseButton).not.toBeInTheDocument();
  });

  test('calls handleSurpriseMe when Surprise Me button is clicked', () => {
    // ARRANGE: Create props with isSurpriseMe enabled
    const propsWithSurprise = { ...defaultProps, isSurpriseMe: true };
    
    // ACT: Render component and click button
    render(<FormField {...propsWithSurprise} />);
    const surpriseButton = screen.getByText('Surprise Me');
    fireEvent.click(surpriseButton);
    
    // ASSERT: Check that handleSurpriseMe was called
    expect(defaultProps.handleSurpriseMe).toHaveBeenCalled();
  });

  test('input has required attribute', () => {
    // ARRANGE & ACT: Render component
    render(<FormField {...defaultProps} />);
    
    // ASSERT: Check that input is required
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  test('handles different input types', () => {
    // ARRANGE: Create props with email type
    const emailProps = { ...defaultProps, type: 'email' };
    
    // ACT: Render component
    render(<FormField {...emailProps} />);
    
    // ASSERT: Check that input has correct type
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });
});

