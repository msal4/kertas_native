import React, { useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { View, Image } from "react-native-ui-lib";
import { Error } from "../components/Error";
import Loading from "../components/Loading";
import { KText } from "../components/KText";

import { Touchable } from "../components/Touchable";
import { NotificationFragment, useNotificationsQuery } from "../generated/graphql";
import dayjs from "dayjs";
import { cdnURL } from "../constants/Config";

export function NotificationsScreen() {
  const [after, setAfter] = useState<string>();
  const [res, refetch] = useNotificationsQuery({ variables: { after } });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View row style={{ paddingTop: 10, backgroundColor: "#f4f4f4" }} />
      <SafeAreaView style={{ flex: 1 }}>
        {res.data?.notifications && (
          <FlatList
            data={res.data.notifications.edges}
            keyExtractor={(item) => item?.node?.id!}
            contentContainerStyle={{ paddingVertical: 10 }}
            onEndReached={() => {
              if (!res.fetching && res.data?.notifications?.pageInfo.hasNextPage) {
                setAfter(res.data?.notifications?.pageInfo.endCursor);
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
            renderItem={({ item }) => (
              <NotificationItem key={item?.node?.id} notification={item?.node!} />
            )}
          />
        )}
        <Error isError={!!res.error} onPress={refetch} />
        <Loading isLoading={res.fetching && !res.data} />
      </SafeAreaView>
    </View>
  );
}

function NotificationItem({ notification }: { notification: NotificationFragment }) {
  return (
    <Touchable
      onPress={() => {
        //navigate("Conversation", { groupID: group.id });
      }}
    >
      <View row style={{ padding: 10 }}>
        <Image
          source={{ uri: `${cdnURL}/${notification.image}` }}
          style={{
            backgroundColor: "#f2f2f2",
            marginRight: 10,
            width: 100,
            height: 100,
            borderRadius: 16,
          }}
        />
        <View style={{ flex: 1 }}>
          <KText style={{ color: "#393939" }}>{notification?.title}</KText>
          <KText style={{ fontSize: 12 }} numberOfLines={3}>
            {notification.body}
          </KText>
          <View style={{ flex: 1 }} />
          <KText style={{ fontSize: 12, fontFamily: "Dubai-Light" }}>
            {dayjs(notification?.createdAt).fromNow()}
          </KText>
        </View>
      </View>
    </Touchable>
  );
}
