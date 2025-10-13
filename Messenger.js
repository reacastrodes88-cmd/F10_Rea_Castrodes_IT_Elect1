//Messenger.js with Image Chathead

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// ✅ Your profile image
const USER_IMAGE = require("./assets/me.jpeg");

// ✅ Friend's image
const FRIEND_IMAGE = require("./assets/gf.jpg");

export default function Messenger() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const autoReplies = [
    "Haha really? 😄",
    "Wait, what do you mean?",
    "That’s kinda funny 😂",
    "Ohh I see!",
    "Hmmm okay 🤔",
    "Nice one!",
    "You’re so random 😆",
    "Awww that’s cute 💕",
    "Tell me more!",
    "Okay okay 😅",
  ];

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Auto-reply after 1 second
    setTimeout(() => {
      const randomReply =
        autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        text: randomReply,
        sender: "friend",
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1000);
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.friendMessageContainer,
        ]}
      >
        {!isMe && <Image source={FRIEND_IMAGE} style={styles.avatar} />}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.friendBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.friendText]}>
            {item.text}
          </Text>
        </View>
        {isMe && <Image source={USER_IMAGE} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ KeyboardAvoidingView to lift input above soft keys */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 120 : 100} // ⬆️ lifted even more
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
        />

        {/* ✅ Input Area - lifted higher */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>➤</Text>
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
  messagesList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  friendMessageContainer: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 6,
    backgroundColor: "#ddd", // fallback color
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: "#0078FF",
    borderTopRightRadius: 0,
  },
  friendBubble: {
    backgroundColor: "#EAEAEA",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
  },
  myText: {
    color: "#fff",
  },
  friendText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: Platform.OS === "android" ? 60 : 0, // ⬆️ lifted more from bottom
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#0078FF",
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 20,
  },
});
