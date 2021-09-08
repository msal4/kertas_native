import React, { useEffect } from "react";
import { View, Image } from "react-native-ui-lib";
import { Error } from "../components/Error";
import Loading from "../components/Loading";
import { KText } from "../components/KText";

import { Touchable } from "../components/Touchable";
import { GroupFragment, useGroupsQuery } from "../generated/graphql";
import { navigate } from "../navigation/navigationRef";
import { useMe } from "../hooks/useMe";
import { getGroupName } from "../util/group";

export function ChatScreen() {
  const [res, refetch] = useGroupsQuery();

  return (
    <View style={{}}>
      {res.data?.groups && res.data.groups.edges?.map((g) => <ChatGroup key={g?.node?.id} group={g?.node!} />)}
      <Error isError={!!res.error} onPress={refetch} />
      <Loading isLoading={res.fetching} />
    </View>
  );
}

function ChatGroup({ group }: { group: GroupFragment }) {
  const { me } = useMe();
  const name = getGroupName(group, me);

  return (
    <Touchable
      onPress={() => {
        navigate("Conversation", { groupID: group.id });
      }}
    >
      <View row centerV style={{ marginBottom: 10, padding: 10 }}>
        <Image source={{ uri: "" }} width={60} height={60} style={{ backgroundColor: "#9a9a9a", marginRight: 10 }} borderRadius={16} />
        <KText>{name}</KText>
      </View>
    </Touchable>
  );
}
