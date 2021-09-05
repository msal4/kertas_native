import React, { useEffect, useState } from "react";
import { View } from "react-native-ui-lib";
import { CombinedError } from "urql";
import Loading from "../components/Loading";
import { useRefreshTokensMutation } from "../generated/graphql";
import { replace } from "../navigation/navigationRef";
import { clearTokens, getRefreshToken, setTokens } from "../util/auth";
import { Error } from "../components/Error";

export function StartScreen() {
  const [, refreshTokens] = useRefreshTokensMutation();
  const [err, setErr] = useState<CombinedError>();
  const [fetching, setFetching] = useState(true);

  const _init = async () => {
    setFetching(true);

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      setFetching(false);
      replace("Login");
      return;
    }

    const res = await refreshTokens({ refreshToken });
    if (res.error) {
      if (res.error.graphQLErrors?.some((e) => e.extensions?.code === "INVALID_TOKEN")) {
        await clearTokens();
        replace("Login");
        setFetching(false);
        return;
      }

      setErr(res.error);
      replace("Login");
      setFetching(false);
      return;
    }

    await setTokens(res.data?.refreshTokens);
    setFetching(false);
    replace("Home");
  };

  useEffect(() => {
    _init();
  }, []);

  return (
    <View>
      <Loading isLoading={fetching} height={500} />
      <Error isError={!!err} msg="Something went wrong" height={500} />
    </View>
  );
}
