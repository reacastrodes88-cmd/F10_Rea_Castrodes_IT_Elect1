// Komento.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const USER_IMAGE = require("./assets/me.jpeg"); // your profile picture
const POST_IMAGE = require("./assets/post.jpg"); // your main post image (add this file)

export default function Komento() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = () => {
    if (comment.trim() === "") return;
    setComments([...comments, { id: Date.now().toString(), text: comment }]);
    setComment("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentBox}>
      <Image source={USER_IMAGE} style={styles.commentAvatar} />
      <View style={styles.commentBubble}>
        <Text style={styles.commentName}>You</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Added KeyboardAvoidingView & ScrollView wrapper */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 90 : 100}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 🧩 Post Header */}
          <View style={styles.postHeader}>
            <Image source={USER_IMAGE} style={styles.profilePicLarge} />
            <View style={styles.postInfo}>
              <Text style={styles.name}>Rea Castrodes</Text>
              <Text style={styles.status}>updated her profile picture.</Text>
              <Text style={styles.date}>Jul 1 • 🌍</Text>
            </View>
          </View>

          {/* 🖼️ Post Image */}
          <Image source={POST_IMAGE} style={styles.postImage} resizeMode="cover" />

          {/* 💬 Comment List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
            }
            scrollEnabled={false} // ✅ disable inner scroll since we already use ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </ScrollView>

        {/* ✏️ Comment Input */}
        <View style={styles.inputRow}>
          <Image source={USER_IMAGE} style={styles.profilePicSmall} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={addComment}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  profilePicLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postInfo: {
    flexDirection: "column",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  status: {
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  postImage: {
    width: "100%",
    height: 400,
    backgroundColor: "#eee",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  profilePicSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    width: 60,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 8,
  },
  commentAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    flexShrink: 1,
  },
  commentName: {
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 3,
  },
  commentText: {
    fontSize: 15,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
});
