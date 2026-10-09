import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image, // Import Image for displaying weather icons
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// Removed: import Icon from 'react-native-vector-icons/Ionicons'; // No longer used

const { width, height } = Dimensions.get('window');

const WeatherScreen = () => {
  const [city, setCity] = useState('Gurgaon'); // Default city
  const [searchCity, setSearchCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set this through a secure runtime configuration in a production build.
  const WEATHER_API_KEY = '';

  // Default cities for quick selection
  const defaultCities = ['Gurgaon', 'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];

  const fetchWeatherData = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast([]);

    if (!WEATHER_API_KEY || WEATHER_API_KEY.length === 0 || WEATHER_API_KEY === 'YOUR_WEATHERAPI_KEY') {
      setError("WeatherAPI.com API Key is not set or invalid. Please check your key.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=6&aqi=no&alerts=no`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.error) {
        setError(data.error.message || 'Could not fetch weather data. Please check city name.');
        setLoading(false);
        return;
      }

      setCurrentWeather(data);

      const processedForecast = data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        day: new Date(day.date).toLocaleString('en-US', { weekday: 'short' }),
        maxTemp: day.day.maxtemp_c.toFixed(0),
        minTemp: day.day.mintemp_c.toFixed(0),
        weather: day.day.condition.text,
        icon: day.day.condition.icon,
      }));

      const todayDate = new Date().toDateString();
      const filteredForecast = processedForecast.filter((day: any) =>
        new Date(day.date).toDateString() !== todayDate
      );

      setForecast(filteredForecast.slice(0, 5));
      setCity(data.location.name);

    } catch (err) {
      console.error("Weather fetch error:", err);
      setError('Failed to fetch weather data. Please check city name or network connection.');
    } finally {
      setLoading(false);
    }
  }, [WEATHER_API_KEY]);

  useEffect(() => {
    fetchWeatherData(city);
  }, [fetchWeatherData, city]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      setSearchCity('');
    } else {
      Alert.alert('Search', 'Please enter a city name.');
    }
  };

  // Helper function to get wind direction text
  const getWindDirectionText = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return 'N';
    if (degree >= 22.5 && degree < 67.5) return 'NE';
    if (degree >= 67.5 && degree < 112.5) return 'E';
    if (degree >= 112.5 && degree < 157.5) return 'SE';
    if (degree >= 157.5 && degree < 202.5) return 'S';
    if (degree >= 202.5 && degree < 247.5) return 'SW';
    if (degree >= 247.5 && degree < 292.5) return 'W';
    if (degree >= 292.5 && degree < 337.5) return 'NW';
    return '';
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#29ca9f', '#fbe2ba']} // Dashboard's gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }} // Dashboard's gradient end point
        style={StyleSheet.absoluteFillObject}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {/* Header & Search */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Weather Forecast</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter city name"
                placeholderTextColor="rgba(255,255,255,0.7)" // Adjusted for consistency
                value={searchCity}
                onChangeText={setSearchCity}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              
            
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Text style={{ fontSize: 24,  }}>🔎</Text>
            </TouchableOpacity>
            </View>
          </View>

          {/* Popular Cities */}
          <View style={styles.popularCitiesContainer}>
            <Text style={styles.popularCitiesTitle}>Popular Cities</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularCitiesScroll}>
              {defaultCities.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.popularCityButton, city === c && styles.activeCityButton]}
                  onPress={() => setCity(c)}
                >
                  <Text style={[styles.popularCityText, city === c && styles.activeCityText]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>


          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" /> {/* Changed color for consistency */}
              <Text style={styles.loadingText}>Fetching weather data...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchWeatherData(city)} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && currentWeather && (
            <>
              {/* Current Weather Card */}
              <View style={styles.currentWeatherCard}>
                <Text style={styles.currentCity}>{currentWeather.location.name}, {currentWeather.location.country}</Text>
                <Text style={styles.currentTemp}>{currentWeather.current.temp_c.toFixed(0)}°C</Text>
                <Text style={styles.currentDescription}>{currentWeather.current.condition.text}</Text>
                <Image
                  source={{ uri: `https:${currentWeather.current.condition.icon}` }}
                  style={styles.weatherIcon}
                />
                <View style={styles.tempMinMax}>
                  <Text style={styles.minMaxText}>Min: {currentWeather.forecast.forecastday[0].day.mintemp_c.toFixed(0)}°C</Text>
                  <Text style={styles.minMaxText}>Max: {currentWeather.forecast.forecastday[0].day.maxtemp_c.toFixed(0)}°C</Text>
                </View>
              </View>

              {/* Additional Details */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>💧</Text>
                  <Text style={styles.detailValue}>{currentWeather.current.humidity}%</Text>
                  <Text style={styles.detailLabel}>Humidity</Text>
                </View>
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>🌬️</Text>
                  <Text style={styles.detailValue}>{currentWeather.current.wind_kph.toFixed(1)} km/h</Text>
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                  <Text style={styles.detailValueSmall}>{getWindDirectionText(currentWeather.current.wind_degree)}</Text>
                  <Text style={styles.detailLabel}>Wind Dir.</Text>
                </View>
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>📊</Text>
                  <Text style={styles.detailValue}>{currentWeather.current.pressure_mb} hPa</Text>
                  <Text style={styles.detailLabel}>Pressure</Text>
                </View>
              </View>
            </>
          )}

          {!loading && !error && forecast.length > 0 && (
            <>
              {/* 5-Day Forecast */}
              <Text style={styles.forecastTitle}>5-Day Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
                {forecast.map((dayData, index) => (
                  <View key={index} style={styles.forecastDayCard}>
                    <Text style={styles.forecastDayText}>{dayData.day}</Text>
                    <Image
                      source={{ uri: `https:${dayData.icon}` }}
                      style={styles.forecastIcon}
                    />
                    <Text style={styles.forecastTemp}>{dayData.maxTemp}° / {dayData.minTemp}°C</Text>
                    <Text style={styles.forecastDesc}>{dayData.weather}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollViewContent: {
    paddingBottom: 100, // Adjusted padding to match Dashboard's scroll view
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    // Dashboard's farmCard-like styling for the header area
    backgroundColor: 'rgba(34, 114, 99, 0.6)', // Darker translucent green
    borderRadius: 20, // Match Dashboard cards
    paddingVertical: 15, // Adjusted padding
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerTitle: {
    fontSize: 28, // Matches Dashboard header text
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)', // Stronger shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    width: '90%', // Adjusted width for better fit within the new header card
    backgroundColor: 'rgba(255,255,255,0.1)', // More subtle translucent background
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 15, // Added margin top for spacing from title
    // Shadows will be inherited from parent header, no need to duplicate
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#FFF',
    fontSize: 16,
    width:'80%',
    // Placeholder color already adjusted above
  },
  searchButton: {
    padding: 8,
    marginRight:-14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', // Slightly more opaque
    shadowColor: '#000', // Added shadow to button
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularCitiesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  popularCitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  popularCitiesScroll: {
    paddingLeft: 5,
  },
  popularCityButton: {
    backgroundColor: 'rgba(255,255,255,0.1)', // Match Dashboard button backgrounds
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Slightly softer border
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCityButton: {
    backgroundColor: 'rgba(255,255,255,0.3)', // Slightly darker when active
    borderColor: 'rgba(255,255,255,0.5)',
  },
  popularCityText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCityText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.2,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.2,
    backgroundColor: 'rgba(244, 67, 54, 0.8)', // Red error background
    borderRadius: 15,
    padding: 20,
    width: '90%',
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  retryButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentWeatherCard: {
    backgroundColor: 'rgba(255,255,255,0.3)', // Consistent translucent background
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    width: '95%',
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  currentCity: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: '200',
    color: '#2c3e50',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 5,
  },
  currentDescription: {
    fontSize: 22,
    color: '#2c3e50',
    textTransform: 'capitalize',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  tempMinMax: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  minMaxText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 30,
    marginLeft:-9,
  },
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.3)', // Consistent translucent background
    borderRadius: 15,
    padding: 15,
    width: (width - 60) / 3, // Ensures 3 cards per row with spacing
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // Consistent border
  },
  detailEmoji: {
    fontSize: 28,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  detailValueSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailLabel: {
    fontSize: 12,
    color: '#2c3e50',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forecastScroll: {
    width: '100%',
    paddingLeft: 10,
  },
  forecastDayCard: {
    backgroundColor: 'rgba(255,255,255,0.3)', // Consistent translucent background
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginRight: 15,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // Consistent border
  },
  forecastDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 5,
  },
  forecastDesc: {
    fontSize: 13,
    color: '#2c3e50',
    textTransform: 'capitalize',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default WeatherScreen;
