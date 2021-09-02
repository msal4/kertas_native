import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation, { replace } from "./navigation";
import { cacheExchange, createClient, dedupExchange, fetchExchange, makeOperation, Operation, Provider as GraphQLProvider } from "urql";
import { clearTokens, getAccessToken, getAccessTokenExp, getRefreshToken, getTokenExp, isTokenExpired, setTokens } from "./util/auth";
import { authExchange } from "@urql/exchange-auth";
import { RefreshTokensDocument, RefreshTokensMutation, RefreshTokensMutationVariables } from "./generated/graphql";
import { retryExchange } from "@urql/exchange-retry";
import { Platform, I18nManager } from "react-native";
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';

let customFonts = {
  'Dubai-Regular': require('./assets/fonts/DubaiW23-Regular.ttf'),
  'Dubai-Medium': require('./assets/fonts/DubaiW23-Medium.ttf'),
  'Dubai-Light': require('./assets/fonts/DubaiW23-Light.ttf'),
  'Dubai-Bold': require('./assets/fonts/DubaiW23-Bold.ttf')
};

const langs = {
  ar: require("./lang/ar.json"),
  en: require("./lang/en.json")
};

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

const client = createClient({
  url: Platform.OS == 'android'? 'http://10.0.2.2:3000/graphql': "http://localhost:3000/graphql",
  // TODO: update to cache-and-network
  requestPolicy: "network-only",
  exchanges: [
    dedupExchange,
    cacheExchange,
    retryExchange({
      maxNumberAttempts: 3,
    }),
    //errorExchange({
    //  onError: async (error) => {
    //    //console.log("on error is called:", error.response.status);
    //    //if (error.response.status === 401) {
    //    //  await clearTokens();
    //    //  replace("Login");
    //    //}
    //  },
    //}),
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
        console.log("-> didAuthError_status:", error.response.status);
        return error.response.status === 401;
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
          console.log("-> refresh token does not exist -> logging out");
          await clearTokens();
          replace("Login");
          return null;
        }

        console.log("-> refreshing tokens");
        // THE REFRESH TOKEN IS OBVOIUSLY NOT VALID OR NOT EVEN A TOKEN. CHECK THAT THE REFRESH TOKEN IS VALID.

        const res = await mutate<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, data);
        console.log("-> refreshTokens_mutate_error:", res.error?.response?.status);

        // TODO: check error
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

export default function App() {
  const [getFontsLoaded, setFontsLoaded] = useState(false);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [lang, setLocale] = useState('ar');

  useEffect(() => {
    if(I18nManager.isRTL == false && lang == 'ar'){
      Updates.reloadAsync();
    }
  });

  useEffect(() => {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    loadFontsAsync();
  });

  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };
  
  const t = (scope, options) => {
    var name = '';
    if(options != undefined && options.name != undefined){
      name = options.name;
    }
    return langs[lang][scope] != undefined? (name != ''? langs[lang][scope].replace('%{name}', name): langs[lang][scope]): scope;
  };

  const screenProps = {
    t: t,
    setLocale: setLocale
  };

  if (!isLoadingComplete || !getFontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <GraphQLProvider value={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} screenProps={screenProps} />
          <StatusBar />
        </SafeAreaProvider>
      </GraphQLProvider>
    );
  }
}
