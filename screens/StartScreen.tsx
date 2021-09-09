import React, { useEffect } from "react";
import Loading from "../components/Loading";
import { useMeQuery } from "../generated/graphql";
import { Error } from "../components/Error";
import { saveCurrentUser } from "../hooks/useMe";
import { RootStackScreenProps } from "../types";
import { useAuth } from "../context/auth";

export function StartScreen({ navigation }: RootStackScreenProps<"Start">) {
  const [res, refetch] = useMeQuery();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (res.data?.me.id) {
      saveCurrentUser(res.data?.me).then(() => {
        setIsAuthenticated(true);
        navigation.replace("Root");
      });
    }
  }, [res.data?.me.id]);

  useEffect(() => {
    if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "NOT_FOUND")) {
      setIsAuthenticated(false);
      navigation.replace("Login");
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
