import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CreatePost from '../../src/pages/CreatePost';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock components
jest.mock('../../src/components', () => ({
  FormField: ({ labelName, name, value, handleChange, handleSurpriseMe, isSurpriseMe }) => (
    <div>
      <label>{labelName}</label>
      <input
        data-testid={`input-${labelName.toLowerCase().replace(' ', '-')}`}
        name={name}
        value={value}
        onChange={handleChange}
      />
      {isSurpriseMe && (
        <button onClick={handleSurpriseMe} data-testid="surprise-button">
          Surprise Me
        </button>
      )}
    </div>
  ),
  Loader: () => <div data-testid="loader">Loading...</div>
}));

// Mock assets
jest.mock('../../src/assets', () => ({
  preview: 'mock-preview.png'
}));

// Mock utils
jest.mock('../../src/utils', () => ({
  getRandomPrompt: jest.fn(() => 'Random prompt from utils')
}));

// Mock fetch
global.fetch = jest.fn();

const CreatePostWrapper = () => (
  <BrowserRouter>
    <CreatePost />
  </BrowserRouter>
);

describe('CreatePost Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<CreatePostWrapper />);
    
    expect(screen.getByText('Generate AI Image')).toBeInTheDocument();
    expect(screen.getByTestId('input-your-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-prompt')).toBeInTheDocument();
    expect(screen.getByTestId('surprise-button')).toBeInTheDocument();
  });

  test('updates form state when inputs change', () => {
    render(<CreatePostWrapper />);
    
    const nameInput = screen.getByTestId('input-your-name');
    const promptInput = screen.getByTestId('input-prompt');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(promptInput, { target: { value: 'A beautiful landscape' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(promptInput.value).toBe('A beautiful landscape');
  });

  test('generate button is disabled when name is empty', () => {
    render(<CreatePostWrapper />);
    
    const generateButton = screen.getByText('Generate');
    expect(generateButton).toBeDisabled();
  });

  test('shows alert when trying to generate without prompt', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CreatePostWrapper />);
    
    const nameInput = screen.getByTestId('input-your-name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please enter prompt');
    alertSpy.mockRestore();
  });

  test('calls API to generate image', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ photo: 'generated-image-url' })
    });

    render(<CreatePostWrapper />);
    
    const nameInput = screen.getByTestId('input-your-name');
    const promptInput = screen.getByTestId('input-prompt');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(promptInput, { target: { value: 'A cat in space' } });
    
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    expect(fetch).toHaveBeenCalledWith(
      'https://aiimagegen-571e.onrender.com/api/v1/dalle',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'A cat in space' })
      })
    );
  });

  test('shows alert when trying to submit without image', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CreatePostWrapper />);
    
    const submitButton = screen.getByText('Share with the community');
    fireEvent.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please  enter a prompt and generate an image');
    alertSpy.mockRestore();
  });

  test('navigates to home after successful submission', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ photo: 'generated-image-url' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

    render(<CreatePostWrapper />);
    
    // Fill form
    const nameInput = screen.getByTestId('input-your-name');
    const promptInput = screen.getByTestId('input-prompt');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(promptInput, { target: { value: 'A cat in space' } });
    
    // Generate image
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    // Submit form
    const submitButton = screen.getByText('Share with the community');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

