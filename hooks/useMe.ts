import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { CurrentUserFragment } from "../generated/graphql";

let user: CurrentUserFragment | null = null;

export async function saveCurrentUser(u: CurrentUserFragment) {
  user = u;
  await AsyncStorage.setItem("me", JSON.stringify(u));
}

async function getCurrentUser() {
  if (user) {
    return user;
  }

  const u = await AsyncStorage.getItem("me");
  if (!u) {
    return null;
  }

  user = JSON.parse(u);
  return user;
}

export function useMe() {
  const [me, setMe] = useState<CurrentUserFragment | null>(user);

  useEffect(() => {
    getCurrentUser().then(setMe);
  }, [user?.id]);

  return { me };
}
