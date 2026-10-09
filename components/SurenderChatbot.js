import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView, // This is for safe area insets
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
// If you're using Image components with local assets, you might not strictly need Ionicons for this component.
// import Icon from 'react-native-vector-icons/Ionicons'; 

// Import useSafeAreaInsets to get dynamic safe area values
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SurenderChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am Surender, your farming assistant 🌾. Ask me about soil, weather, crops, or just say "help"!', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // State for bot typing indicator
  const flatListRef = useRef(null); // Ref for FlatList to auto-scroll

  const fadeAnim = useRef(new Animated.Value(0)).current; // For modal fade-in
  const slideAnim = useRef(new Animated.Value(height * 0.7)).current; // For modal slide-up

  // Get safe area insets
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Animate both fade and slide up when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // Slide up to show the modal
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    let replyText = "I'm not sure how to respond to that. Can you ask me about soil, weather, or crops?";

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      replyText = 'Hi there! How can I help you with your farm today?';
    } else if (lowerCaseMessage.includes('weather')) {
      replyText = 'The current weather in your area is mostly sunny with a chance of light rain tomorrow. Ideal for planting! ☀️🌧️';
    } else if (lowerCaseMessage.includes('soil')) {
      replyText = 'For optimal soil health, consider a balanced NPK fertilizer and ensure good drainage. Would you like to know more about soil testing?';
    } else if (lowerCaseMessage.includes('crop') || lowerCaseMessage.includes('plant')) {
      replyText = 'What specific crop are you interested in? I can provide advice on planting, pest control, and harvesting. 🌽🍅';
    } else if (lowerCaseMessage.includes('pest') || lowerCaseMessage.includes('disease')) {
      replyText = 'Early detection is key for pests and diseases. Can you describe the symptoms you are observing?';
    } else if (lowerCaseMessage.includes('fertilizer') || lowerCaseMessage.includes('nutrient')) {
        replyText = 'Different crops have different nutrient requirements. What crop are you fertilizing?';
    } else if (lowerCaseMessage.includes('water') || lowerCaseMessage.includes('irrigation')) {
        replyText = 'Efficient irrigation is crucial. Consider drip irrigation for water conservation, especially during dry spells.';
    } else if (lowerCaseMessage.includes('harvest')) {
        replyText = 'Harvesting at the right time maximizes yield. What crop are you preparing to harvest?';
    } else if (lowerCaseMessage.includes('help')) {
      replyText = 'I can assist you with: weather forecasts, soil health tips, crop-specific advice, pest/disease queries, and more!';
    }
    // You can add more complex logic or integrate with an actual LLM here

    return replyText;
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true); // Show typing indicator

    setTimeout(() => {
      const botReplyText = generateBotResponse(userMessage.text);
      const botReply = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false); // Hide typing indicator
    }, 1000 + Math.random() * 1000); // Simulate typing delay
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          // Slide the entire chatbot modal from the bottom
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* This View acts as the actual chatbot modal container with fixed height */}
      <View style={[styles.chatbotModalContainer, { height: height * 0.7 }]}>
        <SafeAreaView style={styles.safeAreaContent}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // Adjust offset to account for bottom safe area insets on iOS
            keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 10 : 0} // Added a small extra buffer (10)
          >
            {/* Close Button - positioned absolutely within the KAV, allowing it to move with the keyboard if needed */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image
                source={require('../assets/remove.png')} // Your close icon
                style={styles.iconImageRegular}
              />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('../assets/farmer.png')} // Your farmer icon
                style={styles.avatar}
              />
              <Text style={styles.headerTitle}>Surender Farmer</Text>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              style={styles.messageList}
              contentContainerStyle={{ paddingVertical: 10 }}
            />

            {isTyping && (
              <View style={styles.typingIndicatorContainer}>
                <Text style={styles.typingIndicatorText}>Surender is typing...</Text>
                <ActivityIndicator size="small" color="#76B947" />
              </View>
            )}

            {/* Input */}
            <View style={[
              styles.inputContainer,
              // Add bottom padding to input container for safe area on iOS when keyboard is NOT active
              { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 }
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Ask Surender something..."
                placeholderTextColor="#888"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Image
                  source={require('../assets/send.png')} // Your send icon
                  style={styles.iconImageSmall}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay for background dimming
    justifyContent: 'flex-end', // Aligns the chatbot modal to the bottom
    zIndex: 999, // High zIndex to ensure it's on top of other content
    elevation: 999, // Android elevation
  },
  chatbotModalContainer: {
    // This view defines the actual visual area of the chatbot modal
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // Ensures content respects border radius
    width: '100%', // Take full width of the screen
    // Height is set inline (e.g., height: height * 0.7) for flexibility
    // No fixed height here for styles, it's set dynamically in component
  },
  safeAreaContent: {
    flex: 1, // Allows SafeAreaView to fill its parent (chatbotModalContainer)
  },
  keyboardAvoidingContainer: {
    flex: 1, // Allows KAV to take all available space within SafeAreaView
    paddingHorizontal: 15, // Horizontal padding for the entire chat area
    // Vertical padding will be managed by content and inputContainer's bottom padding
  },
  closeButton: {
    position: 'absolute',
    top: 13, // Adjusted top position
    right: 10, // Adjusted right position
    zIndex: 10, // Ensure it's above other elements
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // A nice green for farming theme
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 20, // Adjusted to be slightly below the close button for better spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageList: {
    flex: 1,
    paddingTop: 5,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Light green for user
    borderBottomRightRadius: 5, // Tweak for chat bubble look
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F7FA', // Light blue for bot
    borderBottomLeftRadius: 5, // Tweak for chat bubble look
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 10,
  },
  typingIndicatorText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 10,
    marginBottom:70,
    paddingBottom:-10,
    // Add bottom padding here to account for the safe area when keyboard is NOT active
    // This ensures content is always visible above the home indicator/bottom bar area
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Consistent vertical padding
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 25,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImageRegular: {
    width: 24,
    height: 24,
  },
  iconImageSmall: {
    width: 18,
    height: 18,
  }
});

export default SurenderChatbot;