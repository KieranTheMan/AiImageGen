// This file runs before all tests to set up the testing environment
require('@testing-library/jest-dom');

// Configure React for testing environment
const React = require('react');

// Ensure React is available globally for hooks to work
global.React = React;

// Mock IntersectionObserver - needed for some components that use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.alert so tests don't show actual alert dialogs
global.alert = jest.fn();

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),    // Prevents console.log from showing in tests
  error: jest.fn(),  // Prevents console.error from showing in tests
  warn: jest.fn(),   // Prevents console.warn from showing in tests
};

//Mock the config module to avoid import.meta issues in tests
jest.mock('../src/config', () => ({
  API_ENDPOINTS: {
    BASE_URL: '/api/v1',
    DALLE: '/api/v1/dalle',
    POST: '/api/v1/post',
  },
  default: {
    BASE_URL: '/api/v1',
    DALLE: '/api/v1/dalle',
    POST: '/api/v1/post',
  }
}));

// Mock fetch globally - this will be used by all tests
global.fetch = jest.fn();

// Add TextEncoder and TextDecoder polyfills for tests
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Clean up after each test - this prevents tests from affecting each other
afterEach(() => {
  jest.clearAllMocks(); // Clears all mock function calls
});