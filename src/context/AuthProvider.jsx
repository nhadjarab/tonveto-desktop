import { useState, createContext, useContext } from "react";

const AuthContext = createContext();
export const useAuth = (_) => useContext(AuthContext);

const LOCAL_STORAGE_KEY = "tonveto-user";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState((_) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storage && storage !== "undefined" && storage !== "null") {
      return JSON.parse(storage);
    }
    return null;
  });

  const loginUser = (v, callback) => {
    setUser(v);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(v));
    callback();
  };

  const value = { user, loginUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
