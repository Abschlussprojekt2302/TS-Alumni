const { handler } = require('./index.js'); // Replace with your actual Lambda file name
const Sequelize = require('sequelize');

// Mock the Sequelize authenticate method
// jest.mock('sequelize', () => {
//   const originalSequelize = jest.requireActual('sequelize');
//   return {
//     ...originalSequelize,
//     authenticate: jest.fn(),
//     query: jest.fn(),
//   };
// });

jest.mock('sequelize');

describe('index.js', () => {
  beforeEach(() => {
    // Clear all instances and calls to the authenticate and query methods
    Sequelize.authenticate.mockClear();
    Sequelize.query.mockClear();
  });

  test('should handle the event and process the user data', async () => {
    const event = {
      body: JSON.stringify({
        userData: {
          id: 'sampleId',
          email: 'sample@email.com',
          name: 'Sample User',
          given_name: 'Sample',
          family_name: 'User',
          picture: 'sample-picture-url',
        },
      }),
    };

    const context = {};

    // Mock sequelize.authenticate to always return a resolved Promise
    Sequelize.authenticate.mockResolvedValueOnce();

    // Mock sequelize.query to return a resolved Promise with empty result for SELECT query
    Sequelize.query.mockResolvedValueOnce([[], {}]);

    // Mock sequelize.query to return a resolved Promise with some result for INSERT query
    Sequelize.query.mockResolvedValueOnce([[], {}]);

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    expect(Sequelize.authenticate).toHaveBeenCalledTimes(1);
    expect(Sequelize.query).toHaveBeenCalledTimes(2);
  });

  // Add more test cases as needed
});
