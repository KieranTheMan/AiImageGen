// Import the functions we want to test
import { getRandomPrompt, downloadImage } from '../src/utils';
import { surpriseMePrompts } from '../src/constants';
import FileSaver from 'file-saver';

// MOCKING SECTION
// Mock FileSaver so we don't actually download files during tests
jest.mock('file-saver', () => ({
  saveAs: jest.fn() // Create a fake function we can track
}));

describe('Utility Functions', () => {
  // Test the getRandomPrompt function
  describe('getRandomPrompt', () => {
    test('should return a random prompt from surpriseMePrompts', () => {
      // ARRANGE: Set up test data
      const currentPrompt = 'test prompt that is not in the array';
      
      // ACT: Call the function we're testing
      const randomPrompt = getRandomPrompt(currentPrompt);
      
      // ASSERT: Check that the result is what we expect
      expect(surpriseMePrompts).toContain(randomPrompt); // Should be from our array
      expect(randomPrompt).not.toBe(currentPrompt); // Should be different from input
    });

    test('should return different prompt if random matches current', () => {
      // ARRANGE: Use the first prompt from our array as current
      const currentPrompt = surpriseMePrompts[0];
      
      // ACT: Call function
      const randomPrompt = getRandomPrompt(currentPrompt);
      
      // ASSERT: Result should be different from current
      expect(randomPrompt).not.toBe(currentPrompt);
      expect(surpriseMePrompts).toContain(randomPrompt);
    });

    test('should handle empty current prompt', () => {
      // ARRANGE
      const currentPrompt = '';
      
      // ACT
      const randomPrompt = getRandomPrompt(currentPrompt);
      
      // ASSERT
      expect(surpriseMePrompts).toContain(randomPrompt);
      expect(typeof randomPrompt).toBe('string');
      expect(randomPrompt.length).toBeGreaterThan(0);
    });
  });

  // Test the downloadImage function
  describe('downloadImage', () => {
    // beforeEach runs before each test in this describe block
    beforeEach(() => {
      // Clear any previous calls to our mocked function
      FileSaver.saveAs.mockClear();
    });

    test('should call FileSaver.saveAs with correct parameters', async () => {
      // ARRANGE: Set up test data
      const mockId = '12345';
      const mockPhoto = 'data:image/jpeg;base64,mockdata';
      
      // ACT: Call the function (it's async so we use await)
      await downloadImage(mockId, mockPhoto);
      
      // ASSERT: Check that FileSaver.saveAs was called with right parameters
      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        mockPhoto, 
        `download-${mockId}.jpg`
      );
    });

    test('should handle different id formats', async () => {
      // ARRANGE: Test with different ID format
      const mockId = 'abc-def-123';
      const mockPhoto = 'https://example.com/image.jpg';
      
      // ACT
      await downloadImage(mockId, mockPhoto);
      
      // ASSERT: Should still work correctly
      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        mockPhoto, 
        `download-${mockId}.jpg`
      );
    });
  });
});
