export const useEnv = () => {
  const apiUrl = window.server.apiUrl;
  return { apiUrl };
};
