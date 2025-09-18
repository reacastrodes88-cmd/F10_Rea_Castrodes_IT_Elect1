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
} from "react-native";

export default function Komento() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = () => {
    if (comment.trim() === "") return;
    setComments([...comments, { id: Date.now().toString(), text: comment }]);
    setComment("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>💬 Comments</Text>

      {/* Comment input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={styles.button}
          onPress={addComment}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Comment list */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    paddingBottom: 6, // 👈 keeps input above system buttons
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  commentBox: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
});