import { createContext, useContext, useEffect, useState } from "react";
import { CombinedError } from "urql";
import { useLoginMutation, useRefreshTokensMutation } from "../generated/graphql";
import { replace } from "../navigation/navigationRef";
import { clearTokens, getRefreshToken, setTokens } from "../util/auth";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void> | void;
  logout: () => Promise<void> | void;
  fetching: boolean;
  error?: CombinedError;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  fetching: false,
});

export const AuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<CombinedError>();
  const [fetching, setFetching] = useState(true);
  const [, _login] = useLoginMutation();
  const [, _refreshTokens] = useRefreshTokensMutation();

  const _init = async () => {
    setFetching(true);

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      setFetching(false);
      replace("Login");
      return;
    }

    const res = await _refreshTokens({ refreshToken });
    if (res.error) {
      if (res.error.graphQLErrors?.some((e) => e.extensions?.code === "INVALID_TOKEN")) {
        await logout();
        setFetching(false);
        return;
      }

      setError(res.error);
      setFetching(false);
      return;
    }

    await setTokens(res.data?.refreshTokens);
    setFetching(false);
  };

  useEffect(() => {
    _init();
  }, []);

  const login = async (username: string, password: string) => {
    setFetching(true);

    const res = await _login({ username, password });
    if (res.error) {
      await clearTokens();
      setIsAuthenticated(false);

      if (res.error.graphQLErrors.some((e) => e.extensions?.code === "INVALID_CREDS")) {
        setFetching(false);
        throw new Error("invalid credentials");
      }

      setFetching(false);
      throw new Error("invalid user");
    }

    if (res.data?.loginUser) {
      await setTokens(res.data.loginUser);
      setIsAuthenticated(true);
      setFetching(false);
    }
  };

  const logout = async () => {
    setFetching(true);
    await clearTokens();
    setIsAuthenticated(false);
    setFetching(false);

    replace("Login");
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, fetching, error }} />;
};

// context
// 1- context
// 2- provider
// 2- consumer | use hook
export const useAuth = () => useContext(AuthContext);
