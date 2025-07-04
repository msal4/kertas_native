import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
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
import { cdnURL } from "../constants/Config";

export function ChatScreen() {
  const [groupType, setGroupType] = useState<GroupType>();
  const [after, setAfter] = useState<string>();
  const [res, refetch] = useGroupsQuery({
    variables: { after, where: groupType && { groupType } },
  });

  const { t } = useTrans();

  useEffect(() => {
    const handler = setInterval(() => !res.fetching && refetch(), 3000);
    return () => clearInterval(handler);
  }, [res.fetching]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View row style={{ paddingTop: 10, backgroundColor: "#f4f4f4" }}>
          <TouchableOpacity
            style={{
              marginRight: 15,
              borderBottomColor: "#6862a9",
              borderBottomWidth: !groupType ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setGroupType(undefined);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("all")}</KText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: 15,
              borderBottomColor: "#6862a9",
              borderBottomWidth: groupType === GroupType.Shared ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setGroupType(GroupType.Shared);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("groups")}</KText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomColor: "#6862a9",
              borderBottomWidth: groupType === GroupType.Private ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setGroupType(GroupType.Private);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("private")}</KText>
          </TouchableOpacity>
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
      <View row style={{ padding: 10 }}>
        {info?.image || group.groupType === GroupType.Private ? (
          <Image
            source={{
              uri: `${cdnURL}/${info?.image}`,
            }}
            style={{
              backgroundColor: "#f2f2f2",
              marginRight: 10,
              width: 60,
              height: 60,
              borderRadius: 16,
            }}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <View row spread centerV style={{ paddingBottom: 5 }}>
            <KText style={{ color: "#393939" }}>{info?.name}</KText>
            <KText style={{ fontSize: 12, fontFamily: "Dubai-Light" }}>
              {dayjs(msg?.createdAt).fromNow()}
            </KText>
          </View>
          {msg ? (
            <KText key={msg?.id} style={{ fontSize: 12 }} numberOfLines={1}>
              {msg.owner?.name}: {msg.content}
            </KText>
          ) : null}
        </View>
      </View>
    </Touchable>
  );
}
