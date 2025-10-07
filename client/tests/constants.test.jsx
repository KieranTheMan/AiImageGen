// Import the constants we want to test
import { surpriseMePrompts } from '../src/constants';

describe('Constants', () => {
  describe('surpriseMePrompts', () => {
    test('should contain expected number of prompts', () => {
      // ASSERT: Check that we have the right number of prompts
      expect(surpriseMePrompts).toHaveLength(46);
    });

    test('all prompts should be non-empty strings', () => {
      // ASSERT: Check that every prompt is a valid string
      surpriseMePrompts.forEach(prompt => {
        expect(typeof prompt).toBe('string');
        expect(prompt.length).toBeGreaterThan(0);
      });
    });

    test('should contain expected sample prompts', () => {
      // ASSERT: Check that some specific prompts exist
      expect(surpriseMePrompts).toContain('an armchair in the shape of an avocado');
      expect(surpriseMePrompts).toContain('a surrealist dream-like oil painting by Salvador Dalí of a cat playing checkers');
      expect(surpriseMePrompts).toContain('teddy bears shopping for groceries in Japan, ukiyo-e');
    });

    test('should not contain duplicate prompts', () => {
      // ARRANGE: Create a set to remove duplicates
      const uniquePrompts = [...new Set(surpriseMePrompts)];
      
      // ASSERT: Check that no duplicates exist
      expect(uniquePrompts).toHaveLength(surpriseMePrompts.length);
    });
  });
});
