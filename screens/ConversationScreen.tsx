import React, { forwardRef, memo, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableHighlight, TouchableOpacity } from "react-native";

import {
  GroupType,
  MessageFragment,
  MessagePostedSubscription,
  useGroupQuery,
  useMessagePostedSubscription,
  useMessagesQuery,
  usePostMessageMutation,
} from "../generated/graphql";
import { RootStackScreenProps } from "../types";
import { Error } from "../components/Error";
import { KText } from "../components/KText";
import { View, Image } from "react-native-ui-lib";
import { useMe } from "../hooks/useMe";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { useTrans } from "../context/trans";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getGroupInfo } from "../util/group";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNativeFile } from "extract-files";
import * as ImagePicker from "expo-image-picker";
import * as mime from "react-native-mime-types";
import ImageView from "react-native-image-viewing";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { cdnURL } from "../constants/Config";
import { isAndroid, isIOS } from "../constants/platform";

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
  const [attachment, setAttachment] = useState<ReactNativeFile>();
  const list = useRef<FlatList>();

  const { t, isRTL } = useTrans();
  const { top, right, bottom, left } = useSafeAreaInsets();

  const _cnt = content.trim();
  const disabled = !_cnt && !attachment;

  const group = res.data?.group;

  const submit = async () => {
    if (disabled) return;

    const input = { content: _cnt, groupID, attachment };
    setContent("");
    setAttachment(undefined);

    list.current?.scrollToOffset({ offset: 0, animated: true });
    const res = await postMessage({ input });
    if (res.error) {
      console.log(res.error);
      return;
    }
  };

  const addAttachment = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (res.cancelled) return;

    const filetype = mime.lookup(res.uri) || "image";

    setAttachment(new ReactNativeFile({ uri: res.uri, name: res.uri.substr(res.uri.lastIndexOf("/") + 1), type: filetype }));
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
        <TouchableOpacity
          style={{ paddingRight: 5 }}
          onPress={() => {
            navigation.pop();
          }}
        >
          <Ionicons color="white" name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} style={{ padding: 5 }} size={30} />
        </TouchableOpacity>
        <Image
          source={{ uri: `${cdnURL}/${info?.image}` }}
          width={40}
          height={40}
          style={{ marginLeft: 10, backgroundColor: "#f2f2f2", marginRight: 10 }}
          borderRadius={8}
        />
        <KText style={{ marginLeft: 5, fontSize: 17, color: "#fff", fontFamily: "Dubai-Medium" }}>{info?.name}</KText>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, paddingLeft: left, paddingRight: right }}
      >
        <MessageList ref={list} groupID={groupID} />

        <View>
          {attachment && (
            <View row centerV style={{ paddingHorizontal: 15, borderTopColor: "#9a9a9a11", borderTopWidth: 2 }}>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  setAttachment(undefined);
                }}
              >
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
              <KText numberOfLines={1} style={{ flex: 1, color: "#9a9a9a" }}>
                {attachment?.name}
              </KText>
            </View>
          )}
          <View
            row
            centerV
            style={{
              paddingVertical: 15,
              borderTopColor: "#9a9a9a11",
              minHeight: 50,
              borderTopWidth: 2,
            }}
          >
            <TouchableOpacity onPress={addAttachment}>
              <Ionicons
                style={{
                  paddingHorizontal: 15,
                  color: attachment ? "#a18cd1" : "#9a9a9a",
                  transform: isRTL ? [{ rotate: "180deg" }] : undefined,
                }}
                name="attach"
                size={25}
              />
            </TouchableOpacity>
            <TextInput
              multiline
              returnKeyType="send"
              value={content}
              onChangeText={setContent}
              style={{ flex: 1, fontSize: 14 }}
              placeholder={t("say_something") + "..."}
              textAlign={isRTL ? "right" : undefined}
              onSubmitEditing={submit}
            />
            <TouchableOpacity style={{ paddingHorizontal: 15 }} disabled={disabled} onPress={submit}>
              <Ionicons
                style={{ color: disabled ? "#9a9a9a" : "#a18cd1", transform: isRTL ? [{ rotate: "180deg" }] : undefined }}
                name={`send${disabled ? "-outline" : ""}` as any}
                size={20}
              />
            </TouchableOpacity>
          </View>
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
            inverted={isIOS}
            ItemSeparatorComponent={() => <View height={15} />}
            style={{ scaleY: isAndroid ? -1 : undefined }}
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

function showToast(msg: string, { duration = Toast.durations.SHORT, position = Toast.positions.BOTTOM } = {}) {
  Toast.show(msg, {
    duration: duration,
    position: position,
    animation: true,
    hideOnPress: true,
    shadow: false,
    backgroundColor: "#383838",
    delay: 0,
  });
}

const MessageItem = memo(({ msg }: { msg: MessageFragment }) => {
  const { me } = useMe();
  const { t } = useTrans();
  const isMe = msg.owner.id === me?.id;

  const hasImage = msg.attachment && mime.lookup(msg.attachment) && mime.lookup(msg.attachment).startsWith("image");
  const [visible, setVisible] = useState(false);

  return (
    <View row style={{ scaleY: isAndroid ? -1 : undefined }}>
      {!isMe ? (
        <Image
          source={{ uri: `${cdnURL}/${msg.owner.image}` }}
          style={{ backgroundColor: "#f2f2f2", marginRight: 15 }}
          borderRadius={16}
          width={60}
          height={60}
        />
      ) : null}
      <TouchableHighlight
        style={{ borderRadius: 16, overflow: "hidden", marginLeft: isMe ? "auto" : undefined, flexGrow: 0, flexShrink: 1 }}
        onLongPress={() => {
          if (msg.content) {
            Clipboard.setString(msg.content);
            showToast(t("message_copied"));
          } else if (msg.attachment) {
            Clipboard.setString(msg.attachment);
            showToast(t("attachment_copied"));
          }
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          colors={isMe ? ["#a7a6cb", "#8989ba"] : ["#e6e9f0", "#eef1f5"]}
          style={{
            padding: 10,
          }}
        >
          <View row spread style={{ paddingBottom: 5 }}>
            {
              <KText style={{ marginRight: 20, fontFamily: "Dubai-Medium", color: isMe ? "#fff" : "#383838" }}>
                {isMe ? t("you") : msg.owner.name}
              </KText>
            }
            <KText style={{ color: isMe ? "#f3f3f3" : "#5f5f5f", fontSize: 13 }}>{dayjs(msg.createdAt as any).fromNow()}</KText>
          </View>

          {hasImage ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
                onLongPress={() => {
                  Clipboard.setString(msg.attachment);
                  showToast(t("attachment_copied"));
                }}
              >
                <Image
                  source={{ uri: `${cdnURL}/${msg.attachment}` }}
                  height={200}
                  width={200}
                  borderRadius={16}
                  style={{
                    alignSelf: "center",
                    marginBottom: msg.content ? 5 : undefined,
                    backgroundColor: "#f2f2f2",
                    minWidth: 200,
                    minHeight: 200,
                    width: 200,
                    height: 200,
                  }}
                />
              </TouchableOpacity>
              <ImageView
                images={[{ uri: `${cdnURL}/${msg.attachment}` }]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setVisible(false)}
              />
            </>
          ) : null}

          <KText style={{ color: isMe ? "white" : "#383838" }}>{msg?.content}</KText>
        </LinearGradient>
      </TouchableHighlight>
    </View>
  );
});
