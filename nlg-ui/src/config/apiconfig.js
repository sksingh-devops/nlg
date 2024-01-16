const baseUrl = {
    development: 'http://localhost:8085',
    production: 'http://localhost:8085',
  };
  
  export const getBaseUrl = () => {
    // Determine the current environment
    const environment = process.env.NODE_ENV || 'development';
  
    // Retrieve the corresponding base URL for the environment
    return baseUrl[environment];
  };
  