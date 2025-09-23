# Server Tests

This directory contains comprehensive tests for the AI Image Generator server.

## Test Structure

```
server/tests/
├── setup.js                    # Test environment setup
├── models/
│   └── Post.test.js            # Post model validation tests
├── routes/
│   ├── PostRoute.test.js       # Post API endpoint tests
│   └── DalleRoute.test.js      # DALL-E API endpoint tests
├── integration/
│   └── server.test.js          # Full workflow integration tests
└── README.md                   # This file
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Only Server Tests
```bash
npm run test:server
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Categories

### 1. Model Tests (`models/Post.test.js`)
- **Validation Tests**: Ensure required fields are enforced
- **Data Integrity**: Test handling of special characters and long strings
- **Query Operations**: Test CRUD operations on the Post model

### 2. Route Tests

#### Post Routes (`routes/PostRoute.test.js`)
- **GET /api/v1/post**: Test retrieving all posts
- **POST /api/v1/post**: Test creating new posts
- **Error Handling**: Test Cloudinary failures, database errors
- **Edge Cases**: Missing fields, invalid data

#### DALL-E Routes (`routes/DalleRoute.test.js`)
- **POST /api/v1/dalle**: Test image generation
- **OpenAI Integration**: Mock OpenAI API responses
- **Error Scenarios**: API failures, rate limits, network errors
- **Input Validation**: Empty prompts, special characters, long prompts

### 3. Integration Tests (`integration/server.test.js`)
- **Complete Workflows**: End-to-end image generation and sharing
- **CORS Configuration**: Test cross-origin request handling
- **Error Propagation**: How errors flow through the system
- **Concurrent Requests**: Multiple simultaneous operations
- **Server Configuration**: Express middleware, body parsing

## Test Environment

### Database
Tests use **MongoDB Memory Server** to provide an isolated database for each test run:
- Fresh database instance for each test suite
- Automatic cleanup after tests
- No impact on development/production databases

### Mocked Services
- **Cloudinary**: Mocked to avoid actual uploads during testing
- **OpenAI API**: Mocked to avoid API costs and rate limits
- **Environment Variables**: Test-specific values set in setup

### Dependencies
- **Jest**: Test framework
- **Supertest**: HTTP endpoint testing
- **MongoDB Memory Server**: In-memory MongoDB for testing

## Writing New Tests

### Test Structure
Follow the AAA pattern:
```javascript
test('should do something', async () => {
  // ARRANGE: Set up test data and mocks
  const testData = { /* ... */ };

  // ACT: Execute the function/endpoint
  const result = await someFunction(testData);

  // ASSERT: Verify the results
  expect(result).toBe(expectedValue);
});
```

### Naming Conventions
- Describe what the test does: "should create post successfully"
- Use clear, descriptive names
- Group related tests in `describe` blocks

### Mock External Services
Always mock external APIs to ensure:
- Tests run quickly
- No external dependencies
- Predictable test results
- No API costs during testing

## Test Coverage

The test suite covers:
- ✅ All API endpoints
- ✅ Model validation
- ✅ Error scenarios
- ✅ Edge cases
- ✅ Integration workflows
- ✅ CORS handling
- ✅ Concurrent operations

## Common Issues

### ES Modules
The server uses ES modules (`import`/`export`). Tests are configured to handle this with:
- `extensionsToTreatAsEsm: [".js"]`
- Jest unstable mock modules for ES imports

### Async Operations
Many operations are async. Always use `await` or return promises in tests.

### Database Cleanup
The test setup automatically cleans the database after each test to ensure test isolation.