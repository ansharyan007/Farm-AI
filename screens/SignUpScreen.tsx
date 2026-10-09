// SignUpScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignUp = () => {
    if (name && email && password) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainAppTabs' }],
        })
      );
    } else {
      alert('Please fill all fields (Name, Email, and Password).');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#2DD4BF', '#059669', '#065F46']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Join FarmAI to start your smart farming journey</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={name}
                onChangeText={setName}
                selectionColor="#FBBF24"
              />

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor="#FBBF24"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                selectionColor="#FBBF24"
              />
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }], width: '100%' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => animatePress(handleSignUp)}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute', bottom: -100, left: -80, width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#0d6e5b',
    borderRadius: 20,
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
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    color: '#FFFFFF',
  },
  button: {
    borderRadius: 16,
    backgroundColor: '#059669',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 25,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
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
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginBottom:15,
    marginTop:-10,
  },
  linkHighlight: {
    fontWeight: '600',
    color: '#FBBF24',
  },
});
