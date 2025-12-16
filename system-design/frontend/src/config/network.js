const getServerUrl = () => {
  return process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
};

export const SERVER_URL = getServerUrl();