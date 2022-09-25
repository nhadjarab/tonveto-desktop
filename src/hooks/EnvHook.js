export const useEnv = () => {
  const apiUrl = "https://vetolib-backend-production.up.railway.app";
  // const apiUrl = process.env.REACT_APP_API_BASE_URL;
  return { apiUrl };
};
