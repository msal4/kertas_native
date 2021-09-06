import AsyncStorage from "@react-native-async-storage/async-storage";
import { authExchange } from "@urql/exchange-auth";
import { retryExchange } from "@urql/exchange-retry";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Platform } from "react-native";
import { Operation, createClient, dedupExchange, cacheExchange, errorExchange, makeOperation, fetchExchange } from "urql";
import { RefreshTokensMutation, RefreshTokensMutationVariables, RefreshTokensDocument } from "../generated/graphql";
import { currentRouteIs, replace } from "../navigation/navigationRef";

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

const isOperationLoginOrRefresh = (operation: Operation) => {
  return (
    operation.kind === "mutation" &&
    operation.query.definitions.some((definition) => {
      return (
        definition.kind === "OperationDefinition" &&
        definition.selectionSet.selections.some((node) => {
          return (
            node.kind === "Field" &&
            (node.name.value === "loginUser" || node.name.value == "loginAdmin" || node.name.value == "refreshTokens")
          );
        })
      );
    })
  );
};

export const client = createClient({ //10.0.2.2
  url: Platform.OS == "android" ? "http://10.10.20.104:3000/graphql" : "http://localhost:3000/graphql",
  // TODO: update to cache-and-network
  requestPolicy: "network-only",
  exchanges: [
    dedupExchange,
    cacheExchange,
    //retryExchange(),
    errorExchange({
      onError: async (error) => {
        console.log("on error is called:", error?.response?.status);
        if (error?.response?.status === 401) {
          await clearTokens();
          replace("Login");
        }
      },
    }),
    authExchange<{ accessToken: string; refreshToken: string; accessTokenExp: string }>({
      addAuthToOperation({ authState, operation }): Operation {
        console.log("-> addAuthToOperation_authState:", authState);

        if (!authState || !authState.accessToken || isOperationLoginOrRefresh(operation)) {
          return operation;
        }

        const fetchOptions =
          typeof operation.context.fetchOptions === "function" ? operation.context.fetchOptions() : operation.context.fetchOptions ?? {};

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...(fetchOptions?.headers ?? {}),
              Authorization: authState.accessToken,
            },
          },
        });
      },
      didAuthError({ error }): boolean {
        console.log("-> didAuthError_status:", error.response?.status);
        return error?.response?.status === 401;
      },
      willAuthError({ authState, operation }): boolean {
        console.log("-> willAuthErr_authState:", authState);
        if (!authState) {
          // let login operations through
          return !isOperationLoginOrRefresh(operation);
        }

        return isTokenExpired(authState.accessTokenExp);
      },
      async getAuth({ authState, mutate }) {
        console.log("-> getAuth_authState:", authState);
        let data = Object.assign({}, authState);

        if (!authState) {
          data.accessToken = (await getAccessToken()) ?? "";
          data.refreshToken = (await getRefreshToken()) ?? "";
          data.accessTokenExp = (await getAccessTokenExp()) ?? "";
        }

        if (data.refreshToken && data.accessToken && !isTokenExpired(data.accessTokenExp ?? "")) {
          console.log("-> tokens are valid");
          return data;
        }

        if (!data.refreshToken) {
          console.log("-> refresh token does not exist");
          await clearTokens();
          replace("Login");
          return null;
        }

        console.log("-> refreshing tokens");

        const res = await mutate<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, data);
        console.log("-> refreshTokens_mutate_error:", res.error?.response?.status);

        if (res.error) {
          console.log("from refresh:", res.error, res.error.response?.status);
          if (res.error.graphQLErrors.some((e) => e.extensions?.code === "INVALID_TOKEN")) {
            await clearTokens();
            replace("Login");
            return null;
          }

          return null;
        }

        // extra check
        if (!res.data?.refreshTokens) {
          console.log("-> res.data.refreshTokens is nil -> logging out");

          await clearTokens();
          replace("Login");
          return null;
        }
        await setTokens(res.data.refreshTokens);
        console.log("-> refreshed tokens");

        return { ...res.data.refreshTokens, accessTokenExp: getTokenExp(res.data.refreshTokens.accessToken) };
      },
    }),
    fetchExchange,
  ],
});
