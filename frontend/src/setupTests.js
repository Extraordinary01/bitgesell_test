require('@testing-library/jest-dom');

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

// optional global test defaults
beforeEach(() => {
  fetch.resetMocks();
});