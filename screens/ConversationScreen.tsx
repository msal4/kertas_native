import React, { forwardRef, memo, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, TextInput } from "react-native";

import {
  GroupType,
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
import { Ionicons } from "@expo/vector-icons";
import { useTrans } from "../context/trans";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getGroupInfo } from "../util/group";
import { LinearGradient } from "expo-linear-gradient";

function handleSubscription(messages: any = [], res?: MessagePostedSubscription) {
  if (!res?.messagePosted) return messages;
  return [res.messagePosted, ...messages];
}

export function ConversationScreen({ route, navigation }: RootStackScreenProps<"Conversation">) {
  const { groupID } = route.params;
  const [, postMessage] = usePostMessageMutation();
  const { me } = useMe();
  const [res] = useGroupQuery({ variables: { groupID } });
  const [content, setContent] = useState("");
  const list = useRef<FlatList>();

  const _cnt = content.trim();

  const { t, isRTL } = useTrans();
  const { top, right, bottom, left } = useSafeAreaInsets();

  const group = res.data?.group;

  const submit = async () => {
    if (!_cnt) return;
    list.current?.scrollToOffset({ offset: 0, animated: true });
    await postMessage({ input: { content: _cnt, groupID } });
    setContent("");
  };

  const info = getGroupInfo(group, me);

  return (
    <>
      <StatusBar style="light" />

      <LinearGradient
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: top + 10,
          paddingRight: right + 10,
          paddingLeft: left + 10,
          paddingBottom: 10,
        }}
        start={{ x: 0, y: 0 }}
        colors={group?.groupType === GroupType.Private ? ["#fecfef", "#ff9a9e"] : ["#fbc2eb", "#a18cd1"]}
      >
        <Touchable
          style={{ paddingRight: 5 }}
          onPress={() => {
            navigation.pop();
          }}
        >
          <Ionicons color="white" name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} style={{ padding: 5 }} size={30} />
        </Touchable>
        <Image
          source={{ uri: `http://localhost:9000/root/${info?.image}` }}
          width={40}
          height={40}
          style={{ marginLeft: 10, backgroundColor: "#f2f2f2", marginRight: 10 }}
          borderRadius={8}
        />
        <KText style={{ marginLeft: 5, fontSize: 17, color: "#fff", fontFamily: "Dubai-Medium" }}>{info?.name}</KText>
      </LinearGradient>

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
          <Touchable disabled={!_cnt} onPress={submit}>
            <Ionicons
              style={{ color: !_cnt ? "#9a9a9a" : "#6A90CC", transform: isRTL ? [{ rotate: "180deg" }] : undefined }}
              name={`send${!_cnt ? "-outline" : ""}` as any}
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
          style={{ backgroundColor: "#f2f2f2", marginRight: 15 }}
          borderRadius={16}
          width={60}
          height={60}
        />
      ) : null}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        colors={isMe ? ["#a7a6cb", "#8989ba"] : ["#e6e9f0", "#eef1f5"]}
        style={{
          padding: 10,
          borderRadius: 16,
          marginLeft: isMe ? "auto" : undefined,
          flexGrow: 0,
          flexShrink: 1,
        }}
      >
        <View row spread style={{ paddingBottom: 5 }}>
          {
            <KText style={{ marginRight: 20, fontFamily: "Dubai-Medium", color: isMe ? "#fff" : "#383838" }}>
              {isMe ? t("you") : msg.owner?.name}
            </KText>
          }
          <KText style={{ color: isMe ? "#f3f3f3" : "#5f5f5f", fontSize: 13 }}>{dayjs(msg.createdAt as any).fromNow()}</KText>
        </View>
        <KText style={{ color: isMe ? "white" : "#383838" }}>{msg?.content}</KText>
      </LinearGradient>
    </View>
  );
}
