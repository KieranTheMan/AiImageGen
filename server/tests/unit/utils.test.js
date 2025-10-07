// Utility function tests for server components

describe('Server Utility Functions', () => {
  describe('HTTP Status Code Helpers', () => {
    test('should identify successful status codes', () => {
      const isSuccessStatus = (status) => status >= 200 && status < 300;

      expect(isSuccessStatus(200)).toBe(true);
      expect(isSuccessStatus(201)).toBe(true);
      expect(isSuccessStatus(299)).toBe(true);

      expect(isSuccessStatus(199)).toBe(false);
      expect(isSuccessStatus(300)).toBe(false);
      expect(isSuccessStatus(400)).toBe(false);
      expect(isSuccessStatus(500)).toBe(false);
    });

    test('should identify error status codes', () => {
      const isErrorStatus = (status) => status >= 400;

      expect(isErrorStatus(400)).toBe(true);
      expect(isErrorStatus(404)).toBe(true);
      expect(isErrorStatus(500)).toBe(true);

      expect(isErrorStatus(200)).toBe(false);
      expect(isErrorStatus(201)).toBe(false);
      expect(isErrorStatus(399)).toBe(false);
    });
  });

  describe('Request Processing Helpers', () => {
    test('should extract file extension from URL', () => {
      const getFileExtension = (url) => {
        try {
          const pathname = new URL(url).pathname;
          const extension = pathname.split('.').pop();
          return extension && extension !== pathname ? extension.toLowerCase() : '';
        } catch {
          return '';
        }
      };

      expect(getFileExtension('https://example.com/image.jpg')).toBe('jpg');
      expect(getFileExtension('https://example.com/image.PNG')).toBe('png');
      expect(getFileExtension('https://example.com/noextension')).toBe('');
      expect(getFileExtension('invalid-url')).toBe('');
    });

    test('should validate image file extensions', () => {
      const isValidImageExtension = (extension) => {
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        return validExtensions.includes(extension.toLowerCase());
      };

      expect(isValidImageExtension('jpg')).toBe(true);
      expect(isValidImageExtension('JPEG')).toBe(true);
      expect(isValidImageExtension('png')).toBe(true);
      expect(isValidImageExtension('gif')).toBe(true);
      expect(isValidImageExtension('webp')).toBe(true);

      expect(isValidImageExtension('txt')).toBe(false);
      expect(isValidImageExtension('pdf')).toBe(false);
      expect(isValidImageExtension('')).toBe(false);
    });

    test('should generate API response format', () => {
      const createAPIResponse = (success, data = null, message = null) => {
        const response = { success };
        if (data !== null) response.data = data;
        if (message !== null) response.message = message;
        return response;
      };

      expect(createAPIResponse(true, { id: 1 })).toEqual({
        success: true,
        data: { id: 1 }
      });

      expect(createAPIResponse(false, null, 'Error occurred')).toEqual({
        success: false,
        message: 'Error occurred'
      });

      expect(createAPIResponse(true)).toEqual({
        success: true
      });
    });
  });

  describe('Date and Time Helpers', () => {
    test('should check if date is valid', () => {
      const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date.getTime());
      };

      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2023-01-01'))).toBe(true);

      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate('2023-01-01')).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });

    test('should format timestamp for logging', () => {
      const formatTimestamp = (date = new Date()) => {
        return date.toISOString();
      };

      const testDate = new Date('2023-01-01T12:00:00.000Z');
      expect(formatTimestamp(testDate)).toBe('2023-01-01T12:00:00.000Z');

      // Should not throw for current date
      expect(() => formatTimestamp()).not.toThrow();
    });
  });

  describe('String Processing Helpers', () => {
    test('should truncate text with ellipsis', () => {
      const truncateText = (text, maxLength, suffix = '...') => {
        if (typeof text !== 'string') return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
      };

      expect(truncateText('Hello World', 10)).toBe('Hello W...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('Hello World', 5, '...')).toBe('He...');
      expect(truncateText(null, 10)).toBe('');
    });

    test('should slugify text for URLs', () => {
      const slugify = (text) => {
        if (typeof text !== 'string') return '';
        return text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Example!')).toBe('test-example');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('')).toBe('');
    });
  });

  describe('Array and Object Helpers', () => {
    test('should check if object is empty', () => {
      const isEmpty = (obj) => {
        if (obj === null || obj === undefined) return true;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
      };

      expect(isEmpty({})).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);

      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty('string')).toBe(false);
    });

    test('should safely get nested object properties', () => {
      const safeGet = (obj, path, defaultValue = undefined) => {
        try {
          return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
        } catch {
          return defaultValue;
        }
      };

      const testObj = {
        user: {
          profile: {
            name: 'John'
          }
        }
      };

      expect(safeGet(testObj, 'user.profile.name')).toBe('John');
      expect(safeGet(testObj, 'user.profile.age')).toBe(undefined);
      expect(safeGet(testObj, 'user.profile.age', 0)).toBe(0);
      expect(safeGet(testObj, 'invalid.path')).toBe(undefined);
      expect(safeGet(null, 'any.path')).toBe(undefined);
    });
  });

  describe('Rate Limiting Helpers', () => {
    test('should calculate time until reset', () => {
      const getTimeUntilReset = (resetTimestamp) => {
        const now = Date.now();
        const reset = new Date(resetTimestamp).getTime();
        return Math.max(0, reset - now);
      };

      const futureTime = Date.now() + 60000; // 1 minute from now
      const pastTime = Date.now() - 60000; // 1 minute ago

      expect(getTimeUntilReset(futureTime)).toBeGreaterThan(0);
      expect(getTimeUntilReset(pastTime)).toBe(0);
    });

    test('should check if request is within rate limit', () => {
      const isWithinRateLimit = (requests, windowMs, maxRequests) => {
        const now = Date.now();
        const windowStart = now - windowMs;
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);
        return recentRequests.length < maxRequests;
      };

      const now = Date.now();
      const recentRequests = [now - 1000, now - 2000, now - 3000]; // 3 requests in last 3 seconds
      const oldRequests = [now - 10000, now - 20000]; // 2 requests from 10+ seconds ago

      expect(isWithinRateLimit([...recentRequests, ...oldRequests], 5000, 5)).toBe(true); // 3 < 5
      expect(isWithinRateLimit([...recentRequests, ...oldRequests], 5000, 3)).toBe(false); // 3 >= 3
    });
  });
});