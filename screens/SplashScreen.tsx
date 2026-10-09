// screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#2DD4BF', '#059669', '#065F46']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Decorative Circles */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <View style={styles.container}>
        <Animatable.Image
          animation="bounceIn"
          duration={1500}
          source={require('../assets/farm-logo.png')}
          style={styles.logo}
        />
        <Animatable.Text animation="fadeInUp" delay={500} style={styles.title}>
          Farm AI
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={1000} style={styles.subtitle}>
          Empowering Farmers with Intelligence
        </Animatable.Text>
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
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
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  activityIndicatorContainer: {
    marginTop: 40,
  },
});
