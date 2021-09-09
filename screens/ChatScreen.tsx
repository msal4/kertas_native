import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { View, Image } from "react-native-ui-lib";
import { Error } from "../components/Error";
import Loading from "../components/Loading";
import { KText } from "../components/KText";

import { Touchable } from "../components/Touchable";
import { GroupDetailFragment, GroupType, useGroupsQuery } from "../generated/graphql";
import { navigate } from "../navigation/navigationRef";
import { useMe } from "../hooks/useMe";
import { getGroupInfo as getGroupInfo } from "../util/group";
import dayjs from "dayjs";
import { useTrans } from "../context/trans";

export function ChatScreen() {
  const [groupType, setGroupType] = useState<GroupType>();
  const [after, setAfter] = useState<string>();
  const [res, refetch] = useGroupsQuery({ variables: { after, where: groupType && { groupType } } });

  const { t } = useTrans();

  useEffect(() => {
    const handler = setInterval(() => !res.fetching && refetch(), 1000);

    return () => clearInterval(handler);
  }, [res.fetching]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View row style={{ paddingTop: 10 }}>
          <Touchable
            style={{ marginRight: 15, borderBottomColor: "#6A90CC", borderBottomWidth: !groupType ? 3 : 0, minWidth: 80 }}
            onPress={() => {
              setGroupType(undefined);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("all")}</KText>
          </Touchable>
          <Touchable
            style={{
              marginRight: 15,
              borderBottomColor: "#6A90CC",
              borderBottomWidth: groupType === GroupType.Shared ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setGroupType(GroupType.Shared);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("groups")}</KText>
          </Touchable>
          <Touchable
            style={{
              borderBottomColor: "#6A90CC",
              borderBottomWidth: groupType === GroupType.Private ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setGroupType(GroupType.Private);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("private")}</KText>
          </Touchable>
        </View>
        {res.data?.groups && (
          <FlatList
            data={res.data.groups.edges}
            keyExtractor={(item) => item?.node?.id!}
            contentContainerStyle={{ paddingVertical: 10 }}
            onEndReached={() => {
              if (!res.fetching && res.data?.groups?.pageInfo.hasNextPage) {
                setAfter(res.data?.groups?.pageInfo.endCursor);
              }
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  alignSelf: "flex-end",
                  height: 1,
                  marginVertical: 10,
                  backgroundColor: "#9a9a9a33",
                  width: "80%",
                }}
              />
            )}
            renderItem={({ item }) => <ChatGroup key={item?.node?.id} group={item?.node!} />}
          />
        )}
        <Error isError={!!res.error} onPress={refetch} />
        <Loading isLoading={res.fetching && !res.data} />
      </SafeAreaView>
    </View>
  );
}

function ChatGroup({ group }: { group: GroupDetailFragment }) {
  const { me } = useMe();
  const info = getGroupInfo(group, me);

  const msg = group.messages?.edges && group.messages.edges[0]?.node;

  return (
    <Touchable
      onPress={() => {
        navigate("Conversation", { groupID: group.id });
      }}
    >
      <View row centerV style={{ padding: 10 }}>
        <Image
          source={{ uri: `http://localhost:9000/root/${info?.image}` }}
          width={60}
          height={60}
          style={{ backgroundColor: "#6A90CC", marginRight: 10 }}
          borderRadius={16}
        />
        <View style={{ flex: 1 }}>
          <View row spread centerV style={{ paddingBottom: 5 }}>
            <KText style={{ color: "#393939" }}>{info?.name}</KText>
            <KText style={{ fontSize: 12, fontFamily: "Dubai-Light" }}>{dayjs(msg?.createdAt).fromNow()}</KText>
          </View>
          <KText key={msg?.id} style={{ fontSize: 12 }} numberOfLines={1}>
            {msg?.owner?.name}: {msg?.content}
          </KText>
        </View>
      </View>
    </Touchable>
  );
}
