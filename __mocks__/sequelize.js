const originalSequelize = jest.requireActual('sequelize');

const mockSequelize = {
  ...originalSequelize,
  authenticate: jest.fn(),
  query: jest.fn(),
};

module.exports = mockSequelize;
