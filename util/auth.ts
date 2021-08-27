import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode, { JwtPayload } from "jwt-decode";

const accessTokenExpKey = "access_token_exp";
const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";

export async function setTokens(data?: { refreshToken: string; accessToken: string } | null) {
  if (!data) {
    return;
  }

  // store expiration date
  await AsyncStorage.setItem(accessTokenExpKey, getTokenExp(data.accessToken));

  await AsyncStorage.setItem(accessTokenKey, data.accessToken);
  await AsyncStorage.setItem(refreshTokenKey, data.refreshToken);
}

export const getRefreshToken = () => AsyncStorage.getItem(refreshTokenKey);

export const getAccessToken = () => AsyncStorage.getItem(accessTokenKey);

export const getAccessTokenExp = () => AsyncStorage.getItem(accessTokenExpKey);

export const getTokenExp = (token: string) => jwtDecode<JwtPayload>(token).exp?.toString() ?? "";

export const isTokenExpired = (exp: string) => Number.parseInt(exp) <= Date.now() / 1000;

export const clearTokens = () => AsyncStorage.multiRemove([refreshTokenKey, accessTokenKey, accessTokenExpKey]);
