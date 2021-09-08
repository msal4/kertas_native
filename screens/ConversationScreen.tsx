import React, { forwardRef, memo, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, TextInput } from "react-native";

import {
  Message,
  MessagePostedSubscription,
  useGroupQuery,
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
import { Ionicons } from "@expo/vector-icons";
import { useTrans } from "../context/trans";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getGroupName } from "../util/group";

function handleSubscription(messages: any = [], res: MessagePostedSubscription) {
  if (!res.messagePosted) return;
  return [res.messagePosted, ...messages];
}

export function ConversationScreen({ route, navigation }: RootStackScreenProps<"Conversation">) {
  const { groupID } = route.params;
  const [, postMessage] = usePostMessageMutation();
  const { me } = useMe();
  const [res] = useGroupQuery({ variables: { groupID } });
  const [content, setContent] = useState("");
  const list = useRef<FlatList>();

  const disabled = !content.trim();

  const { t, isRTL } = useTrans();
  const { top, right, bottom, left } = useSafeAreaInsets();

  const group = res.data?.group;

  const submit = async () => {
    list.current?.scrollToOffset({ offset: 0, animated: true });
    await postMessage({ input: { content, groupID } });
    setContent("");
  };

  return (
    <>
      <StatusBar style="light" />

      <View
        row
        centerV
        style={{
          backgroundColor: "#6A90CC",
          elevation: 10,
          shadowColor: "#9a9a9a",
          shadowRadius: 10,
          shadowOpacity: 1,
          paddingTop: top + 10,
          paddingRight: right + 10,
          paddingLeft: left + 10,
          paddingBottom: 10,
        }}
      >
        <Ionicons
          onPress={() => {
            navigation.pop();
          }}
          color="white"
          name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"}
          style={{ borderRadius: 10, overflow: "hidden" }}
          size={40}
        />
        <KText style={{ marginLeft: 10, fontSize: 17, color: "#fff", fontFamily: "Dubai-Bold" }}>{getGroupName(group, me)}</KText>
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, paddingLeft: left, paddingRight: right }}>
        <MessageList ref={list} groupID={groupID} />

        <View
          row
          centerV
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderTopColor: "#9a9a9a11",
            minHeight: 50,
            borderTopWidth: 2,
          }}
        >
          <TextInput
            multiline
            returnKeyType="send"
            value={content}
            onChangeText={setContent}
            style={{ flex: 1, fontSize: 14, marginRight: 15 }}
            placeholder={t("say_something") + "..."}
            textAlign={isRTL ? "right" : undefined}
            onSubmitEditing={submit}
          />
          <Touchable disabled={disabled} onPress={submit}>
            <Ionicons
              style={{ color: disabled ? "#9a9a9a" : "#6A90CC", transform: isRTL ? [{ rotate: "180deg" }] : undefined }}
              name={`send${disabled ? "-outline" : ""}` as any}
              size={20}
            />
          </Touchable>
        </View>
      </KeyboardAvoidingView>
      <View height={bottom} />
    </>
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
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </>
    );
  })
);

function MessageItem({ msg }: { msg: DeepPartial<Message> }) {
  const { me } = useMe();
  const { t } = useTrans();
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
          {<KText style={{ marginRight: 20, fontFamily: "Dubai-Medium", color: "white" }}>{isMe ? t("you") : msg.owner?.name}</KText>}
          <KText style={{ color: "#f3f3f3", fontSize: 13 }}>{dayjs(msg.createdAt as any).fromNow()}</KText>
        </View>
        <KText style={{ color: "white" }}>{msg?.content}</KText>
      </View>
    </View>
  );
}
