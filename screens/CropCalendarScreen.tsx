import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// --- MOCK DATA FOR DEMONSTRATION ---
const indianStates = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
  'Maharashtra', 'Madhya Pradesh', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

const mockCropData = {
  'Andhra Pradesh': [
    { name: 'Paddy', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Dec', icon: '🍚' },
    { name: 'Maize', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🌽' },
    { name: 'Groundnut', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🥜' },
    { name: 'Cotton', sowing: 'July-Aug', growing: 'Aug-Oct', harvesting: 'Dec-Feb', icon: '☁️' },
  ],
  'Bihar': [
    { name: 'Rice (Kharif)', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🍚' },
    { name: 'Wheat (Rabi)', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌾' },
    { name: 'Maize', sowing: 'Feb-Mar', growing: 'Mar-May', harvesting: 'June-July', icon: '🌽' },
    { name: 'Lentil', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌱' },
  ],
  'Gujarat': [
    { name: 'Cotton', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Dec-Feb', icon: '☁️' },
    { name: 'Groundnut', sowing: 'June-July', growing: 'Aug-Sep', harvesting: 'Oct-Nov', icon: '🥜' },
    { name: 'Wheat', sowing: 'Nov-Dec', growing: 'Dec-Mar', harvesting: 'Mar-Apr', icon: '🌾' },
    { name: 'Castor', sowing: 'July-Aug', growing: 'Aug-Oct', harvesting: 'Dec-Feb', icon: '🌰' },
  ],
  'Haryana': [
    { name: 'Wheat', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Apr-May', icon: '🌾' },
    { name: 'Rice', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🍚' },
    { name: 'Mustard', sowing: 'Sep-Oct', growing: 'Oct-Feb', harvesting: 'Feb-Mar', icon: '🌼' },
    { name: 'Sugarcane', sowing: 'Feb-Mar', growing: 'Apr-Dec', harvesting: 'Dec-Mar', icon: '🎋' },
  ],
  'Karnataka': [
    { name: 'Ragi', sowing: 'June-July', growing: 'Aug-Sep', harvesting: 'Oct-Nov', icon: '🌿' },
    { name: 'Maize', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🌽' },
    { name: 'Paddy', sowing: 'May-June', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🍚' },
    { name: 'Groundnut', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🥜' },
  ],
  'Maharashtra': [
    { name: 'Jowar', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Dec', icon: '🌾' },
    { name: 'Soybean', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🫘' },
    { name: 'Sugarcane', sowing: 'Jan-Feb', growing: 'Mar-Dec', harvesting: 'Dec-Mar', icon: '🎋' },
    { name: 'Onion', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🧅' },
  ],
  'Madhya Pradesh': [
    { name: 'Soybean', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🫘' },
    { name: 'Wheat', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌾' },
    { name: 'Gram', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌱' },
    { name: 'Potato', sowing: 'Oct-Nov', growing: 'Nov-Jan', harvesting: 'Feb-Mar', icon: '🥔' },
  ],
  'Odisha': [
    { name: 'Paddy', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Dec', icon: '🍚' },
    { name: 'Pulses', sowing: 'Sep-Oct', growing: 'Oct-Dec', harvesting: 'Jan-Feb', icon: '🫘' },
    { name: 'Groundnut', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🥜' },
    { name: 'Maize', sowing: 'May-June', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🌽' },
  ],
  'Punjab': [
    { name: 'Wheat', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Apr-May', icon: '🌾' },
    { name: 'Rice', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🍚' },
    { name: 'Maize', sowing: 'Feb-Mar', growing: 'Apr-June', harvesting: 'July-Aug', icon: '🌽' },
    { name: 'Cotton', sowing: 'May-June', growing: 'July-Sep', harvesting: 'Oct-Dec', icon: '☁️' },
  ],
  'Rajasthan': [
    { name: 'Bajra', sowing: 'July-Aug', growing: 'Aug-Sep', harvesting: 'Oct-Nov', icon: '🌾' },
    { name: 'Wheat', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌾' },
    { name: 'Mustard', sowing: 'Sep-Oct', growing: 'Oct-Feb', harvesting: 'Feb-Mar', icon: '🌼' },
    { name: 'Gram', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌱' },
  ],
  'Tamil Nadu': [
    { name: 'Paddy', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Dec', icon: '🍚' },
    { name: 'Groundnut', sowing: 'July-Aug', growing: 'Sep-Nov', harvesting: 'Nov-Dec', icon: '🥜' },
    { name: 'Sugarcane', sowing: 'Jan-Feb', growing: 'Mar-Dec', harvesting: 'Dec-Mar', icon: '🎋' },
    { name: 'Cotton', sowing: 'Oct-Nov', growing: 'Nov-Jan', harvesting: 'Feb-Apr', icon: '☁️' },
  ],
  'Telangana': [
    { name: 'Paddy', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Dec', icon: '🍚' },
    { name: 'Cotton', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Dec-Feb', icon: '☁️' },
    { name: 'Maize', sowing: 'June-July', growing: 'July-Sep', harvesting: 'Oct-Nov', icon: '🌽' },
    { name: 'Red Gram', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Nov-Jan', icon: '🫘' },
  ],
  'Uttar Pradesh': [
    { name: 'Wheat', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🌾' },
    { name: 'Rice', sowing: 'June-July', growing: 'Aug-Oct', harvesting: 'Oct-Nov', icon: '🍚' },
    { name: 'Sugarcane', sowing: 'Feb-Mar', growing: 'Apr-Dec', harvesting: 'Dec-Mar', icon: '🎋' },
    { name: 'Potato', sowing: 'Oct-Nov', growing: 'Nov-Jan', harvesting: 'Feb-Mar', icon: '🥔' },
  ],
  'West Bengal': [
    { name: 'Paddy (Aman)', sowing: 'July-Aug', growing: 'Aug-Nov', harvesting: 'Nov-Dec', icon: '🍚' },
    { name: 'Jute', sowing: 'Mar-May', growing: 'June-Aug', harvesting: 'July-Sep', icon: '🌱' },
    { name: 'Potato', sowing: 'Oct-Nov', growing: 'Nov-Jan', harvesting: 'Feb-Mar', icon: '🥔' },
    { name: 'Lentil', sowing: 'Oct-Nov', growing: 'Nov-Feb', harvesting: 'Mar-Apr', icon: '🫘' },
  ],
};

// Custom Dropdown Component
const CustomDropdown = ({ selectedValue, onValueChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectOption = (option) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchText('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        item === selectedValue && styles.selectedItem
      ]}
      onPress={() => selectOption(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dropdownItemText,
        item === selectedValue && styles.selectedItemText
      ]}>
        {item}
      </Text>
      {item === selectedValue && (
        <Text style={styles.checkIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedValue || placeholder}
        </Text>
        <Text style={[styles.dropdownArrow, isOpen && styles.dropdownArrowUp]}>
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search states..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />

            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const CropCalendarScreen = () => {
  const [selectedState, setSelectedState] = useState('Punjab'); // Default to Punjab
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetching data based on selectedState (replace with actual API call)
    setTimeout(() => {
      const data = mockCropData[selectedState];
      if (data) {
        setCrops(data);
      } else {
        setCrops([]);
        setError(`No specific crop data available for ${selectedState}. Displaying general data if available.`);
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, [selectedState]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#29ca9f', '#fbe2ba']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🌾 Crop Calendar</Text>
            <Text style={styles.headerSubtitle}>Plan your farming activities</Text>
          </View>

          {/* State Selection - Custom Dropdown */}
          <View style={styles.stateSelectionContainer}>
            <Text style={styles.stateSelectionLabel}>Select Your State:</Text>
            <CustomDropdown
              selectedValue={selectedState}
              onValueChange={setSelectedState}
              options={indianStates}
              placeholder="Choose your state"
            />
          </View>

          {/* Data Display Area */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading crop data...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && crops.length > 0 && (
            <View style={styles.cropListContainer}>
              {crops.map((crop, index) => (
                <View key={index} style={styles.cropCard}>
                  <View style={styles.cropCardHeader}>
                    <Text style={styles.cropIcon}>{crop.icon}</Text>
                    <Text style={styles.cropName}>{crop.name}</Text>
                  </View>
                  <View style={styles.cropDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🌱 Sowing:</Text>
                      <Text style={styles.detailValue}>{crop.sowing}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🌿 Growing:</Text>
                      <Text style={styles.detailValue}>{crop.growing}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🚜 Harvesting:</Text>
                      <Text style={styles.detailValue}>{crop.harvesting}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {!loading && !error && crops.length === 0 && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No crop calendar data available for the selected state yet.</Text>
              <Text style={styles.noDataHint}>Select another state or contact support for more information.</Text>
            </View>
          )}

        </ScrollView>
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
  scrollViewContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 20,
    backgroundColor: 'rgba(34, 114, 99, 0.8)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  // Custom Dropdown Styles
  stateSelectionContainer: {
    width: '100%',
    marginBottom: 25,
  },
  stateSelectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3C34',
    marginBottom: 12,
    marginLeft: 5,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    minHeight: 55,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3C34',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#1A3C34',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dropdownArrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3C34',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26, 60, 52, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A3C34',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  optionsList: {
    maxHeight: height * 0.4,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: 'rgba(41, 202, 159, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedItemText: {
    color: '#1A3C34',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    color: '#29ca9f',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
  },
  // Rest of the existing styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#1A3C34',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cropListContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  cropCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  cropCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 10,
  },
  cropIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  cropName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A3C34',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,
  },
  cropDetails: {
    paddingHorizontal: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    opacity: 0.8,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1A3C34',
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  noDataContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3C34',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataHint: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default CropCalendarScreen;
