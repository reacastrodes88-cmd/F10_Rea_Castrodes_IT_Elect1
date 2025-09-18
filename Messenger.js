// Messenger.js

import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Message list component
const MessageList = ({ messages }) => {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={[styles.messageBubble, item.isSent ? styles.sentBubble : styles.receivedBubble]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      )}
      inverted
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
    />
  );
};

export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const nextId = useRef(1);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: nextId.current,
      text: inputText.trim(),
      isSent: true, // all your messages go right side
    };

    nextId.current += 1;
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setInputText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100} // 👈 pushes input higher
      >
        <MessageList messages={messages} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 18,
    maxWidth: "75%",
  },
  sentBubble: {
    backgroundColor: "#0078fe",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 12, // 👈 extra bottom space so it's not blocked
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0078fe",
    borderRadius: 25,
    width: 46,
    height: 46,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});