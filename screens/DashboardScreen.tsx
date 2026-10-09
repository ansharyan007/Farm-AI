import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import SurenderChatbot from '../components/SurenderChatbot';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure this is installed
import LinearGradient from 'react-native-linear-gradient'; // Ensure this is installed

const { width, height } = Dimensions.get('window');

// --- MOCK DATA FOR MARKET PRICES ---
interface CropPrice {
  id: string;
  name: string;
  pricePerKg: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  emoji: string; // Using emoji for icon
  mandi: string; // Added mandi name
}

const mockMarketPrices: CropPrice[] = [
  { id: 'rice', name: 'Basmati Rice', pricePerKg: 65, unit: 'Kg', trend: 'up', lastUpdated: '1 hour ago', emoji: '🍚', mandi: 'Karnal' },
  { id: 'wheat', name: 'Wheat', pricePerKg: 25, unit: 'Kg', trend: 'stable', lastUpdated: '2 hours ago', emoji: '🌾', mandi: 'Chandigarh' },
  { id: 'potato', name: 'Potato', pricePerKg: 20, unit: 'Kg', trend: 'down', lastUpdated: '30 mins ago', emoji: '🥔', mandi: 'Agra' },
  { id: 'onion', name: 'Onion', pricePerKg: 30, unit: 'Kg', trend: 'up', lastUpdated: '1 hour ago', emoji: '🧅', mandi: 'Nashik' },
  { id: 'tomato', name: 'Tomato', pricePerKg: 28, unit: 'Kg', trend: 'down', lastUpdated: '4 hours ago', emoji: '🍅', mandi: 'Bengaluru' },
  { id: 'maize', name: 'Maize', pricePerKg: 22, unit: 'Kg', trend: 'stable', lastUpdated: '5 hours ago', emoji: '🌽', mandi: 'Lucknow' },
  { id: 'cotton', name: 'Cotton', pricePerKg: 70, unit: 'Kg', trend: 'up', lastUpdated: '6 hours ago', emoji: '☁️', mandi: 'Ahmedabad' },
];
// --- END MOCK DATA FOR MARKET PRICES ---

// Simple component to display a single crop price
const CropPriceCard: React.FC<{ crop: CropPrice }> = ({ crop }) => {
  const getTrendIcon = (trend: CropPrice['trend']) => {
    if (trend === 'up') return '▲'; // Up arrow
    if (trend === 'down') return '▼'; // Down arrow
    return '▬'; // Horizontal line for stable
  };

  const getTrendColor = (trend: CropPrice['trend']) => {
    if (trend === 'up') return '#28A745'; // Green
    if (trend === 'down') return '#DC3545'; // Red
    return '#FFC107'; // Yellow/Amber
  };

  return (
    <LinearGradient
      colors={['#f8f8f8', '#ffffff']} // Subtle gradient for the card
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cropPriceCard}
    >
      <View style={styles.cropPriceCardContent}>
        <Text style={styles.cropPriceEmoji}>{crop.emoji}</Text>
        <View style={styles.cropInfo}>
          <Text style={styles.cropPriceName} numberOfLines={1} ellipsizeMode="tail">{crop.name}</Text>
          <Text style={styles.cropPriceValue}>₹{crop.pricePerKg}/{crop.unit}</Text>
          <View style={styles.cropPriceTrend}>
            <Text style={[styles.cropPriceTrendIcon, { color: getTrendColor(crop.trend) }]}>
              {getTrendIcon(crop.trend)}
            </Text>
            <Text style={[styles.cropPriceTrendText, { color: getTrendColor(crop.trend) }]}>
              {crop.trend.charAt(0).toUpperCase() + crop.trend.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.cropPriceMandi}>Mandi: {crop.mandi}</Text>
      <Text style={styles.cropPriceUpdated}>Updated: {crop.lastUpdated}</Text>
    </LinearGradient>
  );
};


const Dashboard = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [moisture, setMoisture] = useState('');
  const [temperature, setTemperature] = useState('');
  const [ph, setPh] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<CropPrice[]>([]);
  const [loadingMarketPrices, setLoadingMarketPrices] = useState(false);

  // --- Auto-Scrolling Refs and State ---
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const contentWidth = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef(false); // To prevent interference while user is touching

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Simulate fetching market prices
    setLoadingMarketPrices(true);
    setTimeout(() => {
      setMarketPrices(mockMarketPrices);
      setLoadingMarketPrices(false);
      startAutoScroll(); // Start auto-scroll after data is loaded
    }, 1000); // Simulate network delay for market prices

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Calculate effective card width including margin
    const cardWidthWithMargin = (width * 0.38) + (8 * 2); // cropPriceCard width + horizontal margin
    
    intervalRef.current = setInterval(() => {
      if (!isScrolling.current && scrollViewRef.current && contentWidth.current > 0) {
        // Calculate the next scroll position based on card width
        const newOffset = scrollOffset.current + cardWidthWithMargin;
        const maxOffset = contentWidth.current - width + (20 * 2); // Adjusted maxOffset to account for screen width and container padding

        if (newOffset >= maxOffset) {
          // If we reach the end, smoothly scroll back to the beginning
          scrollViewRef.current.scrollTo({ x: 0, animated: true });
          scrollOffset.current = 0;
        } else {
          scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
          scrollOffset.current = newOffset;
        }
      }
    }, 3000); // Scroll every 3 seconds
  };

  const pauseAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
    pauseAutoScroll();
  };

  const handleScrollEndDrag = () => {
    isScrolling.current = false;
    startAutoScroll();
  };

  const handleContentSizeChange = (w: number, h: number) => {
    contentWidth.current = w;
  };

  const handleImagePick = (type: 'camera' | 'gallery') => {
    const options = { mediaType: 'photo' as const, includeBase64: false };
    const picker = type === 'camera'
      ? ImagePicker.launchCamera
      : ImagePicker.launchImageLibrary;

    picker(options, (response) => {
      if (response?.didCancel) {
        // User cancelled
      } else if (response?.errorMessage) {
        // Error
      } else if (response?.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri || null);
      }
    });
  };

  const getParameterStatus = (value: string, type: 'moisture' | 'temperature' | 'ph' | 'nitrogen') => {
    if (!value) return { status: 'unknown', color: '#B0BEC5', text: 'Enter value' };
    const numValue = parseFloat(value);
    switch (type) {
      case 'moisture':
        if (numValue < 20) return { status: 'low', color: '#F44336', text: 'Too Dry' };
        if (numValue > 80) return { status: 'high', color: '#FF9800', text: 'Too Wet' };
        return { status: 'optimal', color: '#4CAF50', text: 'Optimal' };
      case 'temperature':
        if (numValue < 15) return { status: 'low', color: '#2196F3', text: 'Too Cold' };
        if (numValue > 35) return { status: 'high', color: '#F44336', text: 'Too Hot' };
        return { status: 'optimal', color: '#4CAF50', text: 'Good' };
      case 'ph':
        if (numValue < 6.0) return { status: 'low', color: '#FF9800', text: 'Acidic' };
        if (numValue > 7.5) return { status: 'high', color: '#9C27B0', text: 'Alkaline' };
        return { status: 'optimal', color: '#4CAF50', text: 'Balanced' };
      case 'nitrogen':
        if (numValue < 20) return { status: 'low', color: '#F44336', text: 'Low' };
        if (numValue > 40) return { status: 'high', color: '#FF9800', text: 'High' };
        return { status: 'optimal', color: '#4CAF50', text: 'Good' };
      default:
        return { status: 'unknown', color: '#B0BEC5', text: 'Enter value' };
    }
  };

  const getSoilRecommendations = async () => {
    setLoadingRecommendations(true);
    setRecommendationError(null);
    setRecommendations(null);

    const prompt = `Based on the following soil parameters, provide concise agricultural recommendations for optimal crop growth. 
                     Be specific and actionable, suggesting adjustments if a parameter is not optimal.
                     Moisture: ${moisture}%, Temperature: ${temperature}°C, pH: ${ph}, Nitrogen: ${nitrogen} PPM.
                     If any parameter is missing or invalid, assume it's "unknown" and provide general advice.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      // IMPORTANT: Replace with your actual API key
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setRecommendations(text);
      } else {
        setRecommendationError('Failed to get recommendations. Please try again.');
      }
    } catch (error) {
      console.error("AI Recommendation error:", error); // Log the actual error
      setRecommendationError('An error occurred while connecting to the AI. Please check your network or try again later.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Full-screen Linear Gradient Background */}
      <LinearGradient
        colors={['#29ca9f', '#fbe2ba']} // Green at top, orangish at bottom
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={styles.fullScreenGradient}
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <Animated.View
              style={[
                styles.headerContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <LinearGradient
                colors={['#227263', '#2e8f80']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.farmCard}
              >
                <View style={styles.row}>
                  <Text style={styles.headerText}>🌾 Farm AI Dashboard ⛅</Text>
                </View>
              </LinearGradient>
            </Animated.View>

          {/* Market Price Section - MOVED TO TOP */}
          <Animated.View
            style={[
              styles.marketPriceSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.marketPriceHeader}>
              <Text style={styles.sectionTitle}>💰 Market Prices</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log('Navigate to full Market Price Screen');
                  // TODO: Implement actual navigation to your dedicated MarketPriceScreen here
                  // Example: navigation.navigate('MarketPriceScreen');
                }}
                style={styles.viewAllPricesButton} // Apply button style
              >
                {/* <Text style={styles.viewAllPricesText}>View All</Text> */}
                {/* <Icon name="chevron-forward-outline" size={20} color="#03A9F4" /> */}
              </TouchableOpacity>
            </View>
            {loadingMarketPrices ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading market prices...</Text>
              </View>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.marketPriceScroll}
                onContentSizeChange={handleContentSizeChange}
                onScroll={e => { scrollOffset.current = e.nativeEvent.contentOffset.x; }}
                scrollEventThrottle={16} // very important for smooth scrolling
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
              >
                {marketPrices.map(crop => (
                  <CropPriceCard key={crop.id} crop={crop} />
                ))}
              </ScrollView>
            )}
          </Animated.View>

          {/* Upload Card */}
          <Animated.View 
            style={[
              styles.uploadCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Image 
              source={require('../assets/cloud.png')}
              style={styles.iconImageLarge} 
            />
            <Text style={styles.uploadText}>Select Image</Text>
            <Text style={styles.uploadHint}>Choose from gallery or use camera</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.optionButton1}
                onPress={() => handleImagePick('gallery')}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../assets/gallery.png')}
                  style={styles.iconImageRegular} 
                />
                <Text style={styles.optionText1}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleImagePick('camera')}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../assets/camera.png')}
                  style={styles.iconImageRegular} 
                />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Soil Parameters Section */}
          <Animated.View 
            style={[
              styles.soilParametersContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌱 Soil Parameters</Text>
              <Text style={styles.sectionSubtitle}>Monitor your soil health</Text>
            </View>
            <View style={styles.parameterGrid}>
              {/* Moisture Card */}
              <View style={[styles.parameterCard, styles.moistureCard]}>
                <View style={styles.parameterHeader}>
                  <View style={styles.parameterIcon}>
                    <Text style={styles.parameterEmoji}>💧</Text>
                  </View>
                  <View style={styles.parameterInfo}>
                    <Text style={styles.parameterLabel}>Soil Moisture</Text>
                    <Text style={styles.parameterUnit}>Percentage (%)</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.parameterInput}
                  value={moisture}
                  onChangeText={setMoisture}
                  placeholder="eg. 50"
                  placeholderTextColor="#A5D6A7"
                  keyboardType="numeric"
                />
                <View style={[styles.statusIndicator, { backgroundColor: getParameterStatus(moisture, 'moisture').color }]}>
                  <Text style={styles.statusText}>{getParameterStatus(moisture, 'moisture').text}</Text>
                </View>
              </View>
              {/* Temperature Card */}
              <View style={[styles.parameterCard, styles.temperatureCard]}>
                <View style={styles.parameterHeader}>
                  <View style={styles.parameterIcon}>
                    <Text style={styles.parameterEmoji}>🌡️</Text>
                  </View>
                  <View style={styles.parameterInfo}>
                    <Text style={styles.parameterLabel}>Soil Temperature</Text>
                    <Text style={styles.parameterUnit}>Celsius (°C)</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.parameterInput}
                  value={temperature}
                  onChangeText={setTemperature}
                  placeholder="eg. 35"
                  placeholderTextColor="#FFCC80"
                  keyboardType="numeric"
                />
                <View style={[styles.statusIndicator, { backgroundColor: getParameterStatus(temperature, 'temperature').color }]}>
                  <Text style={styles.statusText}>{getParameterStatus(temperature, 'temperature').text}</Text>
                </View>
              </View>
              {/* pH Level Card */}
              <View style={[styles.parameterCard, styles.phCard]}>
                <View style={styles.parameterHeader}>
                  <View style={styles.parameterIcon}>
                    <Text style={styles.parameterEmoji}>⚗️</Text>
                  </View>
                  <View style={styles.parameterInfo}>
                    <Text style={styles.parameterLabel}>pH Level</Text>
                    <Text style={styles.parameterUnit}>Acidity (0-14)</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.parameterInput}
                  value={ph}
                  onChangeText={setPh}
                  placeholder="eg. 7"
                  placeholderTextColor="#CE93D8"
                  keyboardType="numeric"
                />
                <View style={[styles.statusIndicator, { backgroundColor: getParameterStatus(ph, 'ph').color }]}>
                  <Text style={styles.statusText}>{getParameterStatus(ph, 'ph').text}</Text>
                </View>
              </View>
              {/* Nitrogen Card */}
              <View style={[styles.parameterCard, styles.nitrogenCard]}>
                <View style={styles.parameterHeader}>
                  <View style={styles.parameterIcon}>
                    <Text style={styles.parameterEmoji}>🧪</Text>
                  </View>
                  <View style={styles.parameterInfo}>
                    <Text style={styles.parameterLabel}>Nitrogen Level</Text>
                    <Text style={styles.parameterUnit}>PPM (mg/kg)</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.parameterInput}
                  value={nitrogen}
                  onChangeText={setNitrogen}
                  placeholder="eg. 35"
                  placeholderTextColor="#90CAF9"
                  keyboardType="numeric"
                />
                <View style={[styles.statusIndicator, { backgroundColor: getParameterStatus(nitrogen, 'nitrogen').color }]}>
                  <Text style={styles.statusText}>{getParameterStatus(nitrogen, 'nitrogen').text}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Get Recommendations Button */}
          <TouchableOpacity
            style={styles.getRecommendationsButton}
            onPress={getSoilRecommendations}
            disabled={loadingRecommendations}
            activeOpacity={0.8}
          >
            {loadingRecommendations ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.getRecommendationsButtonText}>Get Soil Recommendations</Text>
            )}
          </TouchableOpacity>

          {/* Recommendations Display Section */}
          {recommendationError && (
            <View style={styles.recommendationErrorContainer}>
              <Text style={styles.recommendationErrorText}>{recommendationError}</Text>
            </View>
          )}
          {recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>AI Soil Recommendations</Text>
              <Text style={styles.recommendationsText}>{recommendations}</Text>
            </View>
          )}

          {/* Bottom Cards - AI Analysis and Treatment */}
          <Animated.View 
            style={[
              styles.bottomCards,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.aiCard} activeOpacity={0.8}>
              <Image 
                source={require('../assets/ai.png')}
                style={styles.iconImageLarge} 
              />
              <Text style={styles.aiTitle}>AI Analysis</Text>
              <Text style={styles.aiDesc}>Advanced crop disease detection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.treatmentCard} activeOpacity={0.8}>
              <Image 
                source={require('../assets/treatment.png')}
                style={styles.iconImageLarge} 
              />
              <Text style={styles.aiTitle}>Treatment</Text>
              <Text style={styles.aiDesc}>Personalized care recommendations</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Image Preview */}
          {imageUri && (
            <Animated.View 
              style={[
                styles.imagePreviewContainer,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
                activeOpacity={0.7}
              >
                <Icon name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>

      {/* Floating Chatbot Button (only show if chatbot is closed) */}
      {!chatVisible && (
        <TouchableOpacity
          onPress={() => setChatVisible(true)}
          style={styles.chatToggle}
          activeOpacity={0.8}
        >
          <Image 
              source={require('../assets/farmer.png')}
              style={styles.iconImageLarge1} 
            />
        </TouchableOpacity>
      )}

      {/* Full-screen Chatbot */}
      {chatVisible && (
        <SurenderChatbot onClose={() => setChatVisible(false)} />
      )}
      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fullScreenGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom:-20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerContainer: {
    alignItems: 'center',
  },
  farmCard: {
    margin: 'auto',
    marginBottom: 25,
    borderRadius: 18,
    width: '95%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    marginHorizontal: 20,
    textAlign: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  emoji: {
    fontSize: 22,
  },
  uploadCard: {
    backgroundColor: '#D6F5DC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#76B947',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#2C3E50',
  },
  uploadHint: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    width: '100%',
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionButton1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09832c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginLeft: 8,
  },
  optionText1: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
  soilParametersContainer: {
    width: '100%',
    marginBottom: 25,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A3C34',
    textAlign: 'center',
    justifyContent:'center',
    alignItems:'center',
    marginTop:3,
    margin:'auto',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#323432',
    textAlign: 'center',
    marginTop: 4,
  },
  parameterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  parameterCard: {
    width: (width - (20 * 2) - 15) / 2,
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 15,
  },
  moistureCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  temperatureCard: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  phCard: {
    backgroundColor: '#F3E5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  nitrogenCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  parameterEmoji: {
    fontSize: 20,
  },
  parameterInfo: {
    flex: 1,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3C34',
  },
  parameterUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  parameterInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(118, 185, 71, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  getRecommendationsButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getRecommendationsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationsCard: {
    backgroundColor: '#E0F2F7',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#03A9F4',
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#01579B',
    marginBottom: 10,
    textAlign: 'center',
  },
  recommendationsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  recommendationErrorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F44336',
    alignItems: 'center',
  },
  recommendationErrorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 15,
  },
  aiCard: {
    backgroundColor: '#43A047',
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  treatmentCard: {
    backgroundColor: '#FB8C00',
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  aiDesc: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  iconImageLarge: {
    width: 40,
    height: 40,
  },
  iconImageRegular: {
    width: 24,
    height: 24,
  },
  chatToggle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#43A047',
    padding: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
    overflow: 'hidden',
    marginBottom:69,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%',
    backgroundColor: '#F0F4EF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconImageLarge1:{
    width:30,
    height:30,
  },
  // --- Updated Styles for Market Price Section ---
  marketPriceSection: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#E8F5E9', // Light background for the section
    borderRadius: 18,
    paddingVertical: 10,
    // paddingHorizontal: 10, // Adjust padding - removed to allow cards to fill better
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  marketPriceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20, // Keep padding for header text
  },
  viewAllPricesButton: {
    flexDirection: 'row', // To align text and icon
    alignItems: 'center',
    backgroundColor: 'transparent', // Make button background transparent
    paddingHorizontal: 8, // Adjust padding
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewAllPricesText: {
    color: '#03A9F4', // Blue color for the link
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4, // Space between text and icon
  },
  marketPriceScroll: {
    paddingHorizontal: 10, // Add padding to the scroll view content itself
  },
  cropPriceCard: {
    width: width * 0.38, // Made it smaller, showing approx 2.5 cards
    borderRadius: 15,
    padding: 10, // Reduced padding
    marginHorizontal: 8, // Use horizontal margin for spacing
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute content 
    borderLeftColor: '#29ca9f', // Theme color border
    flexShrink: 0, // Prevent cards from shrinking
    height: 140, // Reduced height for a more compact look
  },
  cropPriceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 0,
  },
  cropPriceEmoji: {
    fontSize: 32, // Smaller emoji
    marginRight: 8, // Space between emoji and text
  },
  cropInfo: {
    flex: 1,
    alignItems: 'flex-start', // Align text to left within its container
  },
  cropPriceName: {
    fontSize: 15, // Smaller font
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Align name to left
    marginBottom: 2,
  },
  cropPriceValue: {
    fontSize: 17, // Slightly smaller
    fontWeight: 'bold',
    color: '#1A3C34',
    marginBottom: 2,
  },
  cropPriceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropPriceTrendIcon: {
    fontSize: 16, // Smaller icon
    marginRight: 4, // Smaller space
  },
  cropPriceTrendText: {
    fontSize: 12, // Smaller text
    color: '#666',
  },
  cropPriceMandi: {
    fontSize: 11, // Smaller
    color: '#555',
    textAlign: 'center',
    marginTop: -5,
    marginRight:10
  },
  cropPriceUpdated: {
    fontSize: 9, // Smaller
    color: '#888',
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default Dashboard;