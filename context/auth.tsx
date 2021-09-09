import React, { createContext, FC, useContext, useState } from "react";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider: FC = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return <AuthContext.Provider {...props} value={{ isAuthenticated, setIsAuthenticated }} />;
};

export const useAuth = () => useContext(AuthContext);
