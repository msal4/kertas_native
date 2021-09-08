import React, { forwardRef, memo, useRef, useState } from "react";
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
import Loading from "../components/Loading";

function handleSubscription(messages: any = [], res: MessagePostedSubscription) {
  return [res.messagePosted, ...messages];
}

export function ConversationScreen({ route }: RootStackScreenProps<"Conversation">) {
  const { groupID } = route.params;
  const [, postMessage] = usePostMessageMutation();
  const [content, setContent] = useState("");
  const list = useRef<FlatList>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MessageList ref={list} groupID={groupID} />
        <TextInput value={content} onChangeText={setContent} style={{ height: 50 }} placeholder="Type here idiot..." />
        <Touchable
          onPress={async () => {
            list.current?.scrollToOffset({ offset: 0, animated: true });
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

interface MessageListProps {
  groupID: string;
}

const MessageList = memo(
  forwardRef(function ({ groupID }: MessageListProps, ref) {
    const [after, setAfter] = useState();
    const [queryResponse, refetch] = useMessagesQuery({ variables: { groupID, after } });
    const [subscriptionResponse] = useMessagePostedSubscription({ variables: { groupID } }, handleSubscription);

    return (
      <>
        <Error isError={!!queryResponse.error} onPress={refetch} />
        <Loading isLoading={queryResponse.fetching && !queryResponse.data} color="#9a9a9a55" />
        {queryResponse.data?.messages ? (
          <FlatList
            ref={ref as any}
            ItemSeparatorComponent={() => <View height={15} />}
            inverted
            contentContainerStyle={{ padding: 10 }}
            data={[...(subscriptionResponse.data ?? []), ...(queryResponse.data.messages?.edges?.map((e) => e?.node) ?? [])]}
            renderItem={({ item }) => <MessageItem msg={item} />}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
              if (!queryResponse.fetching && queryResponse?.data?.messages?.pageInfo.hasNextPage) {
                setAfter(queryResponse?.data?.messages?.pageInfo.endCursor);
              }
            }}
          ></FlatList>
        ) : null}
      </>
    );
  })
);

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
          <KText style={{ marginRight: 20, fontFamily: "Dubai-Medium", color: "white" }}>{msg.owner?.name}</KText>
          <KText style={{ color: "#f3f3f3", fontSize: 13 }}>{dayjs(msg.createdAt as any).fromNow()}</KText>
        </View>
        <KText style={{ color: "white" }}>{msg?.content}</KText>
      </View>
    </View>
  );
}
