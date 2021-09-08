import React, { useEffect } from "react";
import Loading from "../components/Loading";
import { useMeQuery } from "../generated/graphql";
import { replace } from "../navigation/navigationRef";
import { Error } from "../components/Error";
import { saveCurrentUser } from "../hooks/useMe";

export function StartScreen() {
  const [res, refetch] = useMeQuery();

  useEffect(() => {
    if (res.data?.me.id) {
      saveCurrentUser(res.data?.me);
      replace("Root");
    }
  }, [res.data?.me.id]);

  useEffect(() => {
    if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "NOT_FOUND")) {
      replace("Login");
    }
  }, [res.error]);

  return (
    <>
      <Error color="black" onPress={refetch} isError={!!res.error} msg="Something went wrong" height={500} />
      <Loading color="gray" isLoading={res.fetching} height={500} />
    </>
  );
}
