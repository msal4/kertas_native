import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useMeQuery } from "../generated/graphql";
import { Error } from "../components/Error";
import { saveCurrentUser } from "../hooks/useMe";
import { RootStackScreenProps } from "../types";
import { useAuth } from "../context/auth";
import { replace } from "../navigation/navigationRef";

export function StartScreen({ navigation }: RootStackScreenProps<"Start">) {
  const [res, refetch] = useMeQuery();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    console.log(res.data, res.error, res.fetching);
    if (res.data?.me.id) {
      saveCurrentUser(res.data?.me).then(() => {
        setIsAuthenticated(true);
        replace("Root");
      });
    }
  }, [res.data?.me.id]);

  useEffect(() => {
    console.log(res.data, res.error, res.fetching);
    if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "NOT_FOUND")) {
      setIsAuthenticated(false);
      replace("Login");
      return;
    }
  }, [res.error]);

  return (
    <>
      <Error color="black" onPress={refetch} isError={!!res.error} msg="Something went wrong" height={500} />
      <Loading color="gray" isLoading={res.fetching} height={500} />
    </>
  );
}
