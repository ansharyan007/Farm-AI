// screens/HomeScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient'; // Keep for the background gradient

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2DD4BF', '#059669', '#065F46']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Decorative Circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Main Content Container with Animations */}
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo Section */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.logoWrapper}>
              <Image source={require('../assets/farm-logo.png')} style={styles.logo} />
              <View style={styles.logoGlow} />
            </View>
          </Animated.View>

          {/* Title and Subtitle */}
          <Animated.View style={[styles.titleContainer]}>
            <Text style={styles.title}>Farm AI</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>
              Revolutionizing agriculture with{'\n'}
              <Text style={styles.highlightText}>smart technology</Text>
            </Text>
          </Animated.View>

          {/* Features Section */}
          <Animated.View style={[styles.featuresContainer]}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🌱</Text>
              </View>
              <Text style={styles.featureText}>Smart Crops</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>📊</Text>
              </View>
              <Text style={styles.featureText}>Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🤖</Text>
              </View>
              <Text style={styles.featureText}>AI Insights</Text>
            </View>
          </Animated.View>

          {/* Buttons Section */}
          <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonSlideAnim }] }]}>
            {/* Sign In Button (now consistent with Sign Up button style) */}
            <TouchableOpacity
              style={styles.signInButton} // Solid background applied here
              onPress={() => animatePress(() => navigation.navigate('SignIn'))}
              activeOpacity={0.8} // Changed activeOpacity for consistency
            >
              <View style={styles.buttonContent}> {/* Reused for consistent layout */}
                <Text style={styles.primaryButtonText}>Sign In</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Sign Up Button (remains as is) */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => animatePress(() => navigation.navigate('SignUp'))}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}> {/* Reused for consistent layout */}
                <Text style={styles.secondaryButtonText}>Create Account</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Tagline */}
          <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tagline}>Join thousands of farmers growing smarter</Text>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 80, // Adjust top padding for status bar and safe area
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: -1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  highlightText: {
    fontWeight: '600',
    color: '#FBBF24',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 40,
  },
  // Reused style for the content inside both buttons
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  signInButton: {
    backgroundColor: '#0d6e5b', // Solid green background for Sign In
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Consistent shadows with signUpButton or a bit stronger as it's primary
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: '#0d6e5b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600', // Made consistent with secondaryButtonText
    marginRight: 8,
  },
  secondaryButtonText: {
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
  bottomContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
    fontStyle: 'italic',
  },
});