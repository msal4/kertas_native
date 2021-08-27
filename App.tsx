import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { cacheExchange, createClient, dedupExchange, fetchExchange, makeOperation, Operation, Provider as ClientProvider } from "urql";
import { clearTokens, getAccessToken, getAccessTokenExp, getRefreshToken, getTokenExp, isTokenExpired, setTokens } from "./util/auth";
import { authExchange } from "@urql/exchange-auth";
import { RefreshTokensDocument, RefreshTokensMutation, RefreshTokensMutationVariables } from "./generated/graphql";

const client = createClient({
  url: "http://localhost:3000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange<{ accessToken: string; refreshToken: string; accessTokenExp: string }>({
      addAuthToOperation({ authState, operation }): Operation {
        if (!authState || !authState.accessToken) {
          return operation;
        }
        const fetchOptions =
          typeof operation.context.fetchOptions === "function" ? operation.context.fetchOptions() : operation.context.fetchOptions;

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...(fetchOptions?.headers || {}),
              Authorization: authState.accessToken,
            },
          },
        });
      },
      didAuthError({ error }): boolean {
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
        if (refreshToken && accessToken) {
          console.log("got tokens from storage");
          const accessTokenExp = await getAccessTokenExp();
          return { accessToken, refreshToken, accessTokenExp: accessTokenExp ?? "" };
        }

        if (!refreshToken) return null;

        console.log("failed to get tokens from storage... refreshing tokens");
        const res = await mutate<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, { refreshToken });
        // TODO: check error
        if (res.data?.refreshTokens) {
          await setTokens(res.data.refreshTokens);
          console.log("tokens refreshed successfully");

          return { ...res.data.refreshTokens, accessTokenExp: getTokenExp(res.data.refreshTokens.accessToken) };
        }

        console.log("failed to refresh tokens and there is nothing to do here but to logout the user :(");

        // TODO: logout
        await clearTokens();
        return null;
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
      <ClientProvider value={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ClientProvider>
    );
  }
}
