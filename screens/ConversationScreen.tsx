import React, { useState } from "react";
import { FlatList, SafeAreaView, TextInput } from "react-native";

import {
  Message,
  MessagePostedSubscription,
  useMessagePostedSubscription,
  useMessagesQuery,
  usePostMessageMutation,
} from "../generated/graphql";
import { DeepPartial, RootStackScreenProps } from "../types";
import { Error } from "../components/Error";
import { KText } from "../components/KText";
import { Touchable } from "../components/Touchable";
import { View, Image } from "react-native-ui-lib";
import { useMe } from "../hooks/useMe";
import dayjs from "dayjs";

function handleSubscription(messages: any = [], res: MessagePostedSubscription) {
  return [res.messagePosted, ...messages];
}

export function ConversationScreen({ route }: RootStackScreenProps<"Conversation">) {
  const { groupID } = route.params;
  const [after, setAfter] = useState();
  const [response, refetch] = useMessagesQuery({ variables: { groupID, after } });
  const [res] = useMessagePostedSubscription({ variables: { groupID } }, handleSubscription);
  const [, postMessage] = usePostMessageMutation();
  const [content, setContent] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Touchable
        onPress={() => {
          if (!response.fetching && response?.data?.messages?.pageInfo.hasNextPage) {
            setAfter(response?.data?.messages?.pageInfo.endCursor);
          }
        }}
      >
        <KText>Load more</KText>
      </Touchable>
      <View style={{ flex: 1 }}>
        <Error isError={!!response.error} onPress={refetch} />
        {response.data?.messages ? (
          <FlatList
            ItemSeparatorComponent={() => <View height={15} />}
            inverted
            contentContainerStyle={{ padding: 20 }}
            data={[...(res.data ?? []), ...(response.data.messages?.edges?.map((e) => e?.node) ?? [])]}
            renderItem={({ item }) => <MessageItem msg={item} />}
            keyExtractor={(item) => item.id}
            onScroll={() => {}}
          ></FlatList>
        ) : null}
        <TextInput value={content} onChangeText={setContent} style={{ height: 50 }} placeholder="Type here idiot..." />
        <Touchable
          onPress={async () => {
            await postMessage({ input: { content, groupID } });
            setContent("");
          }}
        >
          <KText style={{ color: "blue" }}>Send</KText>
        </Touchable>
      </View>
    </SafeAreaView>
  );
}

function MessageItem({ msg }: { msg: DeepPartial<Message> }) {
  const { me } = useMe();
  const isMe = msg.owner?.id === me?.id;

  return (
    <View row>
      {!isMe ? (
        <Image
          source={{ uri: `http://localhost:9000/root/${msg.owner?.image}` }}
          style={{ backgroundColor: "#9a9a9a55", marginRight: 15 }}
          borderRadius={16}
          width={60}
          height={60}
        />
      ) : null}
      <View
        style={{
          backgroundColor: isMe ? "#6A90CC" : "#9a9a9a99",
          padding: 10,
          borderRadius: 16,
          marginLeft: isMe ? "auto" : undefined,
          flexGrow: 0,
          flexShrink: 1,
        }}
      >
        <View row spread style={{ paddingBottom: 5 }}>
          <KText style={{ marginRight: 20, fontFamily: "Dubai-Bold", color: "white" }}>{msg.owner?.name}</KText>
          <KText style={{ color: "#f3f3f3", fontSize: 13 }}>{dayjs(msg.createdAt as any).fromNow()}</KText>
        </View>
        <KText style={{ color: "white", fontFamily: "Dubai-Light" }}>{msg?.content}</KText>
      </View>
    </View>
  );
}
