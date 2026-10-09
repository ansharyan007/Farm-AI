// screens/CommunityForumScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const { width } = Dimensions.get('window');

// Mock data for forum topics/posts
export interface ForumPost { // Export interface for use in CommunityChatScreen
  id: string;
  user: string;
  timestamp: string;
  topic: string;
  lastMessage: string;
  messagesCount: number;
  voiceSupport?: boolean; // Indicates if this topic has voice chat
}

const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    user: 'Farmer John',
    timestamp: '2 hours ago',
    topic: 'Best organic fertilizers for corn',
    lastMessage: 'I found a great recipe using compost and fish emulsion!',
    messagesCount: 34,
  },
  {
    id: '2',
    user: 'AgriExpert Sarah',
    timestamp: 'Yesterday',
    topic: 'Managing pest outbreaks in paddy fields',
    lastMessage: 'Neem oil sprays are effective if applied consistently.',
    messagesCount: 88,
  },
  {
    id: '3',
    user: 'Grower Geeta',
    timestamp: '3 days ago',
    topic: 'Sharing tips for rainwater harvesting',
    lastMessage: 'My new pond system saved me a lot this season. Anyone else?',
    messagesCount: 56,
    voiceSupport: true,
  },
  {
    id: '4',
    user: 'Local Farmer',
    timestamp: '1 week ago',
    topic: 'Subsidies for new farming equipment',
    lastMessage: 'Does anyone know about the latest government schemes?',
    messagesCount: 112,
  },
  {
    id: '5',
    user: 'Harvester Mike',
    timestamp: '2 weeks ago',
    topic: 'Discussion: Future of smart irrigation systems',
    lastMessage: 'Looking into drip irrigation with sensor automation.',
    messagesCount: 41,
    voiceSupport: true,
  },
];

const CommunityForumScreen = () => {
  const [message, setMessage] = useState('');
  const scaleAnim = new Animated.Value(1);
  const navigation = useNavigation(); // Get navigation object

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      alert('Message sent! (Mock)');
    }
  };

  const navigateToChat = (post: ForumPost) => {
    navigation.navigate('CommunityChat', { postData: post }); // Navigate to new chat screen
  };

  const renderForumPost = ({ item }: { item: ForumPost }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => navigateToChat(item)}> {/* Add onPress */}
      <View style={styles.postHeader}>
        <Text style={styles.postUser}>{item.user}</Text>
        <Text style={styles.postTimestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.postTopic}>{item.topic}</Text>
      <Text style={styles.postLastMessage}>Last: "{item.lastMessage}"</Text>
      <View style={styles.postFooter}>
        <Text style={styles.postMessagesCount}>{item.messagesCount} messages</Text>
        {item.voiceSupport && (
          <View style={styles.voiceIndicator}>
            <Text style={styles.voiceText}>🎙️ Live Chat</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#29ca9f', '#fbe2ba']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Forum</Text>
          <Text style={styles.headerSubtitle}>Connect with other farmers</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            data={mockForumPosts}
            renderItem={renderForumPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.forumListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input Area (This is for general forum, not per-chat) */}
          {/* For per-chat messaging, this input will be on CommunityChatScreen */}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 20,
    backgroundColor: 'rgba(34, 114, 99, 0.6)',
    borderRadius: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  forumListContent: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  postCard1: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  postUser: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3C34',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#777',
  },
  postTopic: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postLastMessage: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  postMessagesCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  voiceIndicator: {
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  // Removed message input container from this screen
  // messageInputContainer: { ... },
  // messageInput: { ... },
  // sendButton: { ... },
  // sendButtonText: { ... },
});

export default CommunityForumScreen;