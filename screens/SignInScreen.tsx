// screens/SignInScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated, // Import Animated for button press animation
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native'; // Keep this for navigation reset

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animated value for button press feedback
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleSignIn = () => {
    if (email && password) {
      // Simulate authentication
      if (email === 'test@example.com' && password === 'password123') {
        // Navigate and reset stack to prevent going back to sign in
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainAppTabs' }],
          })
        );
      } else {
        alert('Invalid email or password.');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Background Gradient (consistent with HomeScreen) */}
      <LinearGradient
        colors={['#2DD4BF', '#059669', '#065F46']} // Green gradient
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Decorative Circles (consistent with HomeScreen) */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.formWrapper}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.titleUnderline} /> {/* Underline for title */}
            <Text style={styles.subtitle}>Sign in to your FarmAI account</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor="#FBBF24" // Cursor color
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                selectionColor="#FBBF24" // Cursor color
              />
            </View>

            {/* Sign In Button (consistent with HomeScreen primary button) */}
            <TouchableOpacity
              style={[styles.button, { transform: [{ scale: buttonScaleAnim }] }]}
              onPress={() => animatePress(handleSignIn)}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Sign In</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Sign Up Link (consistent with HomeScreen link style) */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Text style={styles.linkHighlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  container: { // LinearGradient now covers the entire screen
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40, // Add vertical padding for content
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    alignItems: 'center',
    backgroundColor: '#0d6e5b',    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#F59E0B', // Accent color from HomeScreen
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Lighter border
    color: '#FFFFFF', // White text
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: { // This style applies to the TouchableOpacity itself
    width: '100%',
    maxWidth: 400,
    borderRadius: 16, // Consistent with HomeScreen buttons
    backgroundColor: '#059669', // Solid green background for the sign-in button
    shadowColor: '#10B981', // Green shadow
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 25, // Space before the link
  },
  // Reused from HomeScreen for consistent button content layout
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18, // Slightly less padding than HomeScreen button to fit screen better
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop:-10,
    marginBottom:15,
  },
  linkHighlight: {
    fontWeight: '600',
    color: '#FBBF24', // Accent color from HomeScreen
  },
});