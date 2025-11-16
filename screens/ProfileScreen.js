// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useSQLiteContext } from "expo-sqlite";

export default function ProfileScreen({ navigation, route = {} }) {
  const currentUser = route?.params?.currentUser || null;
  const db = useSQLiteContext();

  const [profilePic, setProfilePic] = useState(null);
  const [selfies, setSelfies] = useState([]);
  const [caption, setCaption] = useState("");

  // Load profile picture and selfies
  useEffect(() => {
    if (!currentUser) return;
    loadUserData();
    loadSelfies();
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      const user = await db.getFirstAsync(
        "SELECT profile_picture FROM users WHERE id = ?",
        [currentUser.id]
      );
      if (user?.profile_picture) {
        setProfilePic(user.profile_picture);
        // Update currentUser object so other screens can access it
        currentUser.profile_picture = user.profile_picture;
      }
    } catch (err) {
      console.log("Error loading user data:", err);
    }
  };

  const loadSelfies = async () => {
    try {
      const posts = await db.getAllAsync(
        "SELECT * FROM selfie_posts WHERE user_id = ? ORDER BY timestamp DESC",
        [currentUser.id]
      );
      setSelfies(posts);
    } catch (err) {
      console.log("Error loading selfies:", err);
    }
  };

  // Convert image to Base64
  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (err) {
      console.log("Error converting to base64:", err);
      return null;
    }
  };

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take selfies");
      return false;
    }
    return true;
  };

  // Request media library permissions
  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery access is required");
      return false;
    }
    return true;
  };

  // Upload profile picture from gallery - SAVES AS BASE64
  const pickProfilePicture = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        // Convert to Base64
        const base64Image = await convertToBase64(uri);
        
        if (!base64Image) {
          Alert.alert("Error", "Failed to process image");
          return;
        }
        
        // SAVE BASE64 TO DATABASE
        await db.runAsync(
          "UPDATE users SET profile_picture = ? WHERE id = ?",
          [base64Image, currentUser.id]
        );
        
        setProfilePic(base64Image);
        
        // Update currentUser object
        currentUser.profile_picture = base64Image;
        
        Alert.alert("Success", "Profile picture saved permanently! You can now see it in Messenger and Comments.");
      }
    } catch (err) {
      console.log("Error picking profile picture:", err);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  // Take selfie - POSTS TO COMMENT SECTION WITH BASE64 IMAGE
  const takeSelfie = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        // Convert to Base64
        const base64Image = await convertToBase64(uri);
        
        if (!base64Image) {
          Alert.alert("Error", "Failed to process image");
          return;
        }
        
        // Save to selfie_posts table
        await db.runAsync(
          "INSERT INTO selfie_posts (user_id, username, image_uri, caption) VALUES (?, ?, ?, ?)",
          [currentUser.id, currentUser.username, base64Image, caption.trim() || null]
        );
        
        // POST TO COMMENT SECTION WITH IMAGE
        const commentText = caption.trim() || "Posted a selfie 📸";
        await db.runAsync(
          "INSERT INTO comments (user_id, username, comment, image_uri) VALUES (?, ?, ?, ?)",
          [currentUser.id, currentUser.username, commentText, base64Image]
        );
        
        setCaption("");
        loadSelfies();
        Alert.alert("Success", "Selfie posted to Comment Section! Everyone can see it now!");
      }
    } catch (err) {
      console.log("Error taking selfie:", err);
      Alert.alert("Error", "Failed to post selfie");
    }
  };

  // Pick selfie from gallery - POSTS TO COMMENT SECTION WITH BASE64 IMAGE
  const pickSelfie = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        // Convert to Base64
        const base64Image = await convertToBase64(uri);
        
        if (!base64Image) {
          Alert.alert("Error", "Failed to process image");
          return;
        }
        
        // Save to selfie_posts table
        await db.runAsync(
          "INSERT INTO selfie_posts (user_id, username, image_uri, caption) VALUES (?, ?, ?, ?)",
          [currentUser.id, currentUser.username, base64Image, caption.trim() || null]
        );
        
        // POST TO COMMENT SECTION WITH IMAGE
        const commentText = caption.trim() || "Posted a photo 📷";
        await db.runAsync(
          "INSERT INTO comments (user_id, username, comment, image_uri) VALUES (?, ?, ?, ?)",
          [currentUser.id, currentUser.username, commentText, base64Image]
        );
        
        setCaption("");
        loadSelfies();
        Alert.alert("Success", "Photo posted to Comment Section! Everyone can see it now!");
      }
    } catch (err) {
      console.log("Error picking selfie:", err);
      Alert.alert("Error", "Failed to post photo");
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666", marginBottom: 20 }}>Session expired. Please login again.</Text>
        <TouchableOpacity
          style={{ backgroundColor: "#ce93d8", padding: 15, borderRadius: 10 }}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile & Selfies</Text>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity onPress={pickProfilePicture}>
            <View style={styles.profilePicContainer}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
              ) : (
                <View style={styles.placeholderPic}>
                  <Text style={styles.placeholderText}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>{currentUser.username}</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickProfilePicture}>
            <Text style={styles.uploadButtonText}>
              {profilePic ? "Change Profile Picture" : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>This will appear in Messenger & Comments</Text>
        </View>

        {/* Selfie Post Section */}
        <View style={styles.selfieSection}>
          <Text style={styles.sectionTitle}>Post a Selfie</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption (optional)"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cameraButton} onPress={takeSelfie}>
              <Text style={styles.buttonText}>📷 Take Selfie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={pickSelfie}>
              <Text style={styles.buttonText}>🖼️ From Gallery</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.infoText}>Selfies will be posted to Comment Section for everyone to see</Text>
        </View>

        {/* Selfie Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Selfies ({selfies.length})</Text>
          {selfies.length === 0 ? (
            <Text style={styles.emptyText}>No selfies yet. Take your first one!</Text>
          ) : (
            <FlatList
              data={selfies}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.postCard}>
                  <Image source={{ uri: item.image_uri }} style={styles.selfieImage} />
                  {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#ce93d8",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: { color: "#fff", fontSize: 16, marginBottom: 5 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileSection: { alignItems: "center", padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#880e4f" },
  profilePicContainer: { marginBottom: 10 },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#ce93d8" },
  placeholderPic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ce93d8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ddd",
  },
  placeholderText: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  username: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" },
  uploadButton: { backgroundColor: "#ce93d8", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  uploadButtonText: { color: "#fff", fontWeight: "bold" },
  infoText: { fontSize: 12, color: "#999", marginTop: 8, fontStyle: "italic" },
  selfieSection: { padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  captionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    minHeight: 60,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cameraButton: { backgroundColor: "#f48fb1", flex: 1, marginRight: 10, paddingVertical: 12, borderRadius: 25, alignItems: "center" },
  galleryButton: { backgroundColor: "#ce93d8", flex: 1, paddingVertical: 12, borderRadius: 25, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  postsSection: { padding: 20, paddingBottom: 40 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 10 },
  postCard: { backgroundColor: "#fce4ec", borderRadius: 15, padding: 15, marginBottom: 15 },
  selfieImage: { width: "100%", height: 300, borderRadius: 10, marginBottom: 10 },
  caption: { fontSize: 16, color: "#333", marginBottom: 5 },
  timestamp: { fontSize: 12, color: "#666" },
});