import AsyncStorage from "@react-native-async-storage/async-storage";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Platform } from "react-native";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Operation, createClient, dedupExchange, errorExchange, makeOperation, fetchExchange, subscriptionExchange } from "urql";
import { RefreshTokensMutation, RefreshTokensMutationVariables, RefreshTokensDocument } from "../generated/graphql";
import { replace } from "../navigation/navigationRef";

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

const url = Platform.select({ ios: "http://localhost:3000/graphql", android: "http://10.0.2.2:3000/graphql" })!;

const subscriptionClient = new SubscriptionClient(url.replace("http", "ws"), {
  reconnect: true,
  connectionParams: async () => ({ authorization: await getAccessToken() }),
});

export const client = createClient({
  url: Platform.OS == "android" ? "http://10.0.2.2:3000/graphql" : "http://localhost:3000/graphql",
  requestPolicy: "network-only",
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          messages: relayPagination(),
        },
      },
    }),
    errorExchange({
      onError: async (error) => {
        if (error?.response?.status === 401) {
          await clearTokens();
          replace("Login");
        }
      },
    }),
    authExchange<{ accessToken: string; refreshToken: string; accessTokenExp: string }>({
      addAuthToOperation({ authState, operation }): Operation {
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
        return error?.response?.status === 401;
      },
      willAuthError({ authState, operation }): boolean {
        if (!authState) {
          // let login operations through
          return !isOperationLoginOrRefresh(operation);
        }

        return isTokenExpired(authState.accessTokenExp);
      },
      async getAuth({ authState, mutate }) {
        let data = Object.assign({}, authState);

        if (!authState) {
          data.accessToken = (await getAccessToken()) ?? "";
          data.refreshToken = (await getRefreshToken()) ?? "";
          data.accessTokenExp = (await getAccessTokenExp()) ?? "";
        }

        if (data.refreshToken && data.accessToken && !isTokenExpired(data.accessTokenExp ?? "")) {
          return data;
        }

        if (!data.refreshToken) {
          await clearTokens();
          replace("Login");
          return null;
        }

        const res = await mutate<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, data);
        if (res.error) {
          if (res.error.graphQLErrors.some((e) => e.extensions?.code === "INVALID_TOKEN")) {
            await clearTokens();
            replace("Login");
            return null;
          }

          return null;
        }

        // extra check
        if (!res.data?.refreshTokens) {
          await clearTokens();
          replace("Login");
          return null;
        }
        await setTokens(res.data.refreshTokens);

        return { ...res.data.refreshTokens, accessTokenExp: getTokenExp(res.data.refreshTokens.accessToken) };
      },
    }),
    fetchExchange,
    multipartFetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation) as any,
    }),
  ],
});
