import React, { useState } from "react";
import { FlatList, SafeAreaView, TextInput, View } from "react-native";
import { Message, useMessagesQuery, usePostMessageMutation } from "../generated/graphql";
import { DeepPartial, RootStackScreenProps } from "../types";
import { Error } from "../components/Error";
import { KText } from "../components/KText";
import { Touchable } from "../components/Touchable";

export function ConversationScreen({ route }: RootStackScreenProps<"Conversation">) {
  const { groupID } = route.params;
  const [res, refetch] = useMessagesQuery({ variables: { groupID } });
  const [, postMessage] = usePostMessageMutation();

  const [content, setContent] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Error isError={!!res.error} onPress={refetch} />
        {res.data?.messages && (
          <FlatList
            inverted
            style={{}}
            data={res.data?.messages.edges}
            renderItem={({ item }) => <MessageItem key={item?.node?.id} msg={item?.node!} />}
            keyExtractor={(item) => item?.node?.id!}
          ></FlatList>
        )}
        <TextInput value={content} onChangeText={setContent} style={{ height: 50 }} placeholder="Type here idiot..." />
        <Touchable
          onPress={async () => {
            await postMessage({ input: { content, groupID } });
            refetch();
          }}
        >
          <KText style={{ color: "blue" }}>Send message</KText>
        </Touchable>
      </View>
    </SafeAreaView>
  );
}

function MessageItem({ msg }: { msg: DeepPartial<Message> }) {
  return (
    <View>
      <KText>{msg.content}</KText>
    </View>
  );
}
