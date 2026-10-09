// screens/CommunityChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ForumPost } from './CommunityForumScreen'; // Import ForumPost interface

// Mock data for messages within a chat. In a real app, this would come from a backend.
interface ChatMessage {
  id: string;
  sender: 'Me' | string;
  text?: string;
  voiceUrl?: string; // Placeholder for voice message URL
  timestamp: string;
}

const mockChatMessages: ChatMessage[] = [
  { id: 'm1', sender: 'Farmer John', text: 'Hey, everyone! Just joined this group.', timestamp: '10:00 AM' },
  { id: 'm2', sender: 'Me', text: 'Welcome John! What are you growing this season?', timestamp: '10:05 AM' },
  { id: 'm3', sender: 'Farmer John', text: 'Mostly corn and some soybeans.', timestamp: '10:10 AM' },
  { id: 'm4', sender: 'AgriExpert Sarah', text: 'If you have corn, consider organic fertilizers like compost tea. It really boosts soil health.', timestamp: '10:15 AM' },
  { id: 'm5', sender: 'Me', text: 'That sounds interesting! Any specific recipes for compost tea?', timestamp: '10:20 AM' },
  { id: 'm6', sender: 'Farmer John', voiceUrl: 'voice_message_1.mp3', timestamp: '10:25 AM' }, // Mock voice message
  { id: 'm7', sender: 'AgriExpert Sarah', text: 'I can share a basic one. Mix well-rotted compost with water, let it steep, and aerate it. I’ll send a link to a detailed guide.', timestamp: '10:30 AM' },
  { id: 'm8', sender: 'Me', text: 'Awesome, thanks!', timestamp: '10:35 AM' },
];

const CommunityChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postData } = route.params as { postData: ForumPost }; // Get passed data

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const flatListRef = useRef<FlatList>(null);
  const recordingAnim = useRef(new Animated.Value(0)).current; // For recording animation

  useEffect(() => {
    // Scroll to the bottom of the chat when component mounts or messages change
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: `m${chatMessages.length + 1}`,
        sender: 'Me',
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleVoiceRecordStart = () => {
    console.log('Voice recording started...');
    // Start animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordingAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(recordingAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Alert.alert('Voice Recording', 'Recording voice message... Press and hold to record. Release to send.');
    // In a real app, you would start actual audio recording here
  };

  const handleVoiceRecordEnd = () => {
    console.log('Voice recording ended.');
    recordingAnim.stopAnimation(); // Stop animation
    recordingAnim.setValue(0); // Reset animation value
    const newVoiceMessage: ChatMessage = {
      id: `m${chatMessages.length + 1}`,
      sender: 'Me',
      voiceUrl: 'mock_voice_message.mp3', // This would be the actual URL after upload
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prevMessages) => [...prevMessages, newVoiceMessage]);
    Alert.alert('Voice Message', 'Voice message sent! (Mock)');
    // In a real app, you would stop recording, process audio, upload, and then send the message
  };

  const handlePlayVoiceMessage = (url: string) => {
    Alert.alert('Play Voice Message', `Playing voice message from: ${url} (Mock)`);
    console.log('Playing voice message:', url);
    // In a real app, you would use an audio playback library here
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'Me' ? styles.myMessage : styles.otherMessage,
    ]}>
      {item.sender !== 'Me' && <Text style={styles.messageSender}>{item.sender}</Text>}
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.voiceUrl && (
        <TouchableOpacity onPress={() => handlePlayVoiceMessage(item.voiceUrl!)} style={styles.voiceMessageButton}>
          <Text style={styles.voiceMessageIcon}>▶️</Text>
          <Text style={styles.voiceMessageText}>Voice Message</Text>
        </TouchableOpacity>
      )}
      <Text style={item.sender === 'Me' ? styles.myMessageTimestamp : styles.otherMessageTimestamp}>
        {item.timestamp}
      </Text>
    </View>
  );

  const animatedMicStyle = {
    transform: [{
      scale: recordingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2], // Scales from normal to 120%
      }),
    }],
  };


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
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{postData.topic}</Text>
            <Text style={styles.headerSubtitle}>By {postData.user}</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust for keyboard pushing content
        >
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatMessagesContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input Area */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message..."
              placeholderTextColor="rgba(0,0,0,0.6)"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            {message.trim().length > 0 ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            ) : (
              <Animated.View style={[styles.micButtonContainer, animatedMicStyle]}>
                <TouchableOpacity
                  style={styles.micButton}
                  onPressIn={handleVoiceRecordStart}
                  onPressOut={handleVoiceRecordEnd}
                >
                  <Text style={styles.micIcon}>🎤</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
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
    // No horizontal padding here, chat bubbles will handle it
    backgroundColor: 'transparent',
  },
  header: {
    width: '90%',
    alignContent:'center',
    justifyContent:'center',
    alignSelf:'center',
    textAlign:'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    backgroundColor: 'rgba(34, 114, 99, 0.6)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',

  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5, // Make touch target larger
  },
  headerIcon: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    marginRight: 38, // Offset for back button to visually center title
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign:'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatMessagesContainer: {
    paddingHorizontal: 10, // Padding for messages
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Light green for my messages
    borderBottomRightRadius: 5, // Pointy corner for self
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF', // White for other messages
    borderBottomLeftRadius: 5, // Pointy corner for others
  },
  messageSender: {
    fontSize: 12,
    color: '#075E54', // Dark green for sender name
    fontWeight: 'bold',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  myMessageTimestamp: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  otherMessageTimestamp: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  voiceMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 15,
    marginTop: 5,
  },
  voiceMessageIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 5,
  },
  voiceMessageText: {
    color: '#fff',
    fontSize: 14,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: Platform.OS === 'ios' ? 10 : 10, // Adjusted for keyboard
    marginTop: 10,
    marginHorizontal: 10, // Add horizontal margin for the input container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingRight: 10,
    maxHeight: 100, // Prevent input from growing too large
    minHeight: 40,
    paddingVertical: 10, // Adjust vertical padding for multiline
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  micButtonContainer: {
    marginLeft: 10,
  },
  micButton: {
    backgroundColor: '#FFEB3B', // Yellow accent for mic
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  micIcon: {
    fontSize: 22,
    color: '#333',
  },
});

export default CommunityChatScreen;