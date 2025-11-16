// screens/Komento.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function Komento({ route = {}, navigation }) {
  const currentUser = route?.params?.currentUser || null;
  const db = useSQLiteContext();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [userProfiles, setUserProfiles] = useState({});

  const loadComments = async () => {
    try {
      const results = await db.getAllAsync(
        'SELECT * FROM comments ORDER BY timestamp ASC',
        []
      );
      setComments(results);

      // Load profile pictures for all users who commented
      const userIds = [...new Set(results.map(c => c.user_id))];
      const profiles = {};
      for (const userId of userIds) {
        const user = await db.getFirstAsync(
          'SELECT id, username, profile_picture FROM users WHERE id = ?',
          [userId]
        );
        if (user) {
          profiles[userId] = user;
        }
      }
      setUserProfiles(profiles);
    } catch (err) {
      console.log('Error loading comments:', err);
    }
  };

  useEffect(() => {
    loadComments();
    
    // Auto-refresh comments every 3 seconds
    const interval = setInterval(() => {
      loadComments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ADD COMMENT - EVERYONE CAN COMMENT
  const addComment = async () => {
    if (!text.trim() || !currentUser) return;
    try {
      await db.runAsync(
        'INSERT INTO comments (user_id, username, comment) VALUES (?, ?, ?)',
        [currentUser.id, currentUser.username, text]
      );
      setText('');
      loadComments();
    } catch (err) {
      console.log('Error adding comment:', err);
    }
  };

  const renderProfilePicture = (userId) => {
    const user = userProfiles[userId];
    if (user?.profile_picture) {
      return (
        <Image
          source={{ uri: user.profile_picture }}
          style={styles.commentProfilePic}
        />
      );
    }
    return (
      <View style={styles.commentPlaceholderPic}>
        <Text style={styles.placeholderText}>
          {user?.username?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
    );
  };

  const renderCurrentUserPic = () => {
    if (currentUser?.profile_picture) {
      return (
        <Image
          source={{ uri: currentUser.profile_picture }}
          style={styles.inputProfilePic}
        />
      );
    }
    return (
      <View style={styles.inputPlaceholderPic}>
        <Text style={styles.placeholderText}>
          {currentUser?.username?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
    );
  };

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#666', marginBottom: 20 }}>
          Session expired. Please login again.
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#1877F2', padding: 15, borderRadius: 10 }}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0F2F5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comment</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { currentUser })}>
            
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Main Post - Profile Picture Update */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            {currentUser?.profile_picture ? (
              <Image
                source={{ uri: currentUser.profile_picture }}
                style={styles.postProfilePic}
              />
            ) : (
              <View style={[styles.postProfilePic, styles.placeholderPostPic]}>
                <Text style={styles.placeholderText}>
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.postHeaderText}>
              <Text style={styles.postUsername}>{currentUser.username}</Text>
              <View style={styles.postMeta}>
                <Text style={styles.postDate}>
                  updated her profile picture.
                </Text>
                <Text style={styles.postDate}>Jul 1 · 🌍</Text>
              </View>
            </View>
          </View>

          {/* Main Photo */}
          {currentUser?.profile_picture ? (
            <Image
              source={{ uri: currentUser.profile_picture }}
              style={styles.mainPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainPhoto, styles.placeholderMainPhoto]}>
              <Text style={styles.placeholderMainText}>
                {currentUser?.username?.charAt(0).toUpperCase()}
              </Text>
              <Text style={styles.uploadPrompt}>Upload a profile picture first</Text>
            </View>
          )}

          {/* Comments Section - EVERYONE CAN COMMENT AND SEE PHOTOS */}
          <View style={styles.commentsSection}>
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>
                No comments yet. Be the first!
              </Text>
            ) : (
              comments.map((item) => (
                <View key={item.id} style={styles.commentItem}>
                  {renderProfilePicture(item.user_id)}
                  <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentUsername}>{item.username}</Text>
                      <Text style={styles.commentTextContent}>{item.comment}</Text>
                    </View>
                    {/* SHOW IMAGE IF AVAILABLE */}
                    {item.image_uri && (
                      <Image
                        source={{ uri: item.image_uri }}
                        style={styles.commentImage}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Comment Input - LIFTED UP */}
      <View style={styles.inputContainer}>
        {renderCurrentUserPic()}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#65676B"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity>
            <Text style={styles.iconButton}>😊</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.postButton} 
          onPress={addComment}
          disabled={!text.trim()}
        >
          <Text style={[styles.postButtonText, !text.trim() && styles.postButtonDisabled]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 24,
    color: '#050505',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
  },
  commentText: {
    fontSize: 16,
    color: '#1877F2',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  postProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderPostPic: {
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postHeaderText: {
    flex: 1,
  },
  postUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#050505',
  },
  postMeta: {
    flexDirection: 'column',
    marginTop: 2,
  },
  postDate: {
    fontSize: 13,
    color: '#65676B',
  },
  mainPhoto: {
    width: '100%',
    height: 500,
    backgroundColor: '#F0F2F5',
  },
  placeholderMainPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ce93d8',
  },
  placeholderMainText: {
    fontSize: 120,
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadPrompt: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    fontStyle: 'italic',
  },
  commentsSection: {
    padding: 12,
    paddingBottom: 120, // Space for input
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#65676B',
    fontSize: 15,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentPlaceholderPic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    borderRadius: 18,
    padding: 8,
    paddingHorizontal: 12,
    maxWidth: '80%',
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#050505',
    marginBottom: 2,
  },
  commentTextContent: {
    fontSize: 15,
    color: '#050505',
  },
  commentImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#F0F2F5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'android' ? 80 : 40,
  },
  inputProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  inputPlaceholderPic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#050505',
    maxHeight: 100,
  },
  iconButton: {
    fontSize: 20,
    marginLeft: 8,
  },
  postButton: {
    marginLeft: 8,
  },
  postButtonText: {
    color: '#1877F2',
    fontSize: 15,
    fontWeight: '600',
  },
  postButtonDisabled: {
    color: '#BCC0C4',
  },
});