export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.TEST_BASE_URL
    : process.env.API_BASE_URL;
