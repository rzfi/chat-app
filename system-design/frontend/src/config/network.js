const getNetworkConfig = () => {
  const customServerUrl = process.env.REACT_APP_SERVER_URL;
  
  if (customServerUrl) {
    return {
      serverUrl: customServerUrl,
      apiUrl: `${customServerUrl}/api`
    };
  }

  const defaultUrl = 'http://localhost:5000';
  return {
    serverUrl: defaultUrl,
    apiUrl: `${defaultUrl}/api`
  };
};

export const { serverUrl: SERVER_URL, apiUrl: API_URL } = getNetworkConfig();