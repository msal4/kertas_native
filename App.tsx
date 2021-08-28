import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation, { replace } from "./navigation";
import {
  cacheExchange,
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
  makeOperation,
  Operation,
  Provider as GraphQLProvider,
} from "urql";
import { clearTokens, getAccessToken, getAccessTokenExp, getRefreshToken, getTokenExp, isTokenExpired, setTokens } from "./util/auth";
import { authExchange } from "@urql/exchange-auth";
import { RefreshTokensDocument, RefreshTokensMutation, RefreshTokensMutationVariables } from "./generated/graphql";

const client = createClient({
  url: "http://localhost:3000/graphql",
  // TODO: update to cache-and-network
  requestPolicy: "network-only",
  exchanges: [
    dedupExchange,
    cacheExchange,
    errorExchange({
      onError: async (error) => {
        console.log("on error is called:", error.response.status);
        if (error.response.status === 401) {
          await clearTokens();
          replace("Login");
        }
      },
    }),
    authExchange<{ accessToken: string; refreshToken: string; accessTokenExp: string }>({
      addAuthToOperation({ authState, operation }): Operation {
        if (!authState || !authState.accessToken) {
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
        console.log("didAuthError_status:", error.response.status);
        return error.response.status === 401;
      },
      willAuthError({ authState, operation }): boolean {
        if (!authState) {
          // let login operations through
          return !(
            operation.kind === "mutation" &&
            operation.query.definitions.some((definition) => {
              return (
                definition.kind === "OperationDefinition" &&
                definition.selectionSet.selections.some((node) => {
                  return node.kind === "Field" && (node.name.value === "loginUser" || node.name.value == "loginAdmin");
                })
              );
            })
          );
        }

        return isTokenExpired(authState.accessTokenExp);
      },
      async getAuth({ authState, mutate }) {
        if (authState) {
          return null;
        }
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        const accessTokenExp = await getAccessTokenExp();
        if (refreshToken && accessToken && !isTokenExpired(accessTokenExp ?? "")) {
          console.log("got tokens from storage");
          return { accessToken, refreshToken, accessTokenExp: accessTokenExp ?? "" };
        }

        if (!refreshToken) return null;

        console.log("failed to get tokens from storage... refreshing tokens");
        const res = await mutate<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, { refreshToken });
        // TODO: check error
        if (!res.data?.refreshTokens) {
          console.log("failed to refresh tokens and there is nothing to do here but to logout the user :(");

          // TODO: logout
          await clearTokens();
          replace("Login");
          return null;
        }
        await setTokens(res.data.refreshTokens);
        console.log("tokens refreshed successfully");

        return { ...res.data.refreshTokens, accessTokenExp: getTokenExp(res.data.refreshTokens.accessToken) };
      },
    }),
    fetchExchange,
  ],
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GraphQLProvider value={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </GraphQLProvider>
    );
  }
}
