// ReminderScreen.tsx
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SchemeCard from '../components/SchemeCard';

// Adjust path based on your project structure

const { width, height } = Dimensions.get('window');

// --- MOCK DATA FOR FARMER SCHEMES ---
interface Scheme {
  id: string;
  name: string;
  description: string;
  launchDate: string; // e.g., "Jan 1, 2023" or "Q3 2025"
  status: 'previous' | 'upcoming' | 'newly-launched';
  link?: string; // Optional link to government website
  benefits: string[]; // Key benefits
  eligibility: string[]; // Key eligibility criteria
}

const mockSchemes: Scheme[] = [
  // Previous Schemes
  {
    id: 'scheme1',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'A scheme to provide insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.',
    launchDate: 'February 2016',
    status: 'previous',
    link: 'https://pmfby.gov.in/',
    benefits: ['Financial support to farmers', 'Risk coverage against crop failure', 'Promotes adoption of modern agricultural practices'],
    eligibility: ['All farmers including sharecroppers and tenant farmers growing the notified crops in the notified areas.'],
  },
  {
    id: 'scheme2',
    name: 'Kisan Credit Card (KCC) Scheme',
    description: 'A scheme to provide adequate and timely credit support to farmers for their cultivation needs, purchase of agricultural inputs, and post-harvest expenses.',
    launchDate: 'August 1998',
    status: 'previous',
    link: 'https://pmkisan.gov.in/KccApplication.aspx',
    benefits: ['Flexible and simplified procedure for credit', 'Disbursement of crop loans', 'Covers post-harvest expenses and allied activities'],
    eligibility: ['Farmers (individual/joint borrowers) who are engaged in agriculture and allied activities.'],
  },
  {
    id: 'scheme3',
    name: 'Soil Health Card Scheme',
    description: 'A program launched to help farmers improve productivity through judicious use of fertilizers by providing soil nutrient status to farmers.',
    launchDate: 'February 2015',
    status: 'previous',
    link: 'https://www.soilhealth.dac.gov.in/',
    benefits: ['Analyzes soil health', 'Provides recommendations on nutrient management', 'Reduces fertilizer misuse'],
    eligibility: ['All farmers can get a Soil Health Card.'],
  },
  {
    id: 'scheme4',
    name: 'National Agriculture Market (e-NAM)',
    description: 'An online trading platform for agricultural commodities in India. The platform facilitates farmers, traders, and buyers with online trading in commodities.',
    launchDate: 'April 2016',
    status: 'previous',
    link: 'https://www.enam.gov.in/',
    benefits: ['Better price discovery for farmers', 'Transparency in transactions', 'Access to a wider market'],
    eligibility: ['Farmers who are members of APMCs connected to e-NAM.'],
  },
  // Upcoming/Newly Launched Schemes
  {
    id: 'scheme5',
    name: 'PM-KISAN Samman Nidhi (Latest Installment)',
    description: 'Direct income support to all landholding farmer families in India. Details on the next installment release and new registration drives.',
    launchDate: 'Expected Q3 2024',
    status: 'upcoming',
    link: 'https://pmkisan.gov.in/',
    benefits: ['Direct income support for farmers', 'Financial assistance for agricultural needs'],
    eligibility: ['All landholding farmer families, subject to certain exclusion criteria.'],
  },
  {
    id: 'scheme6',
    name: 'New Drone Technology Adoption Program',
    description: 'A proposed scheme to subsidize the purchase and use of agricultural drones for precision farming, spraying, and monitoring.',
    launchDate: 'Expected Early 2025',
    status: 'upcoming',
    benefits: ['Promotes precision agriculture', 'Reduces labor costs', 'Efficient application of inputs'],
    eligibility: ['Farmer producer organizations (FPOs), individual farmers with certain land holdings.'],
  },
  {
    id: 'scheme7',
    name: 'Climate-Resilient Agriculture Initiative',
    description: 'A newly launched initiative focusing on sustainable farming practices, water conservation, and development of climate-resistant crop varieties.',
    launchDate: 'June 2024',
    status: 'newly-launched',
    link: 'https://example.gov.in/climate-resilience', // Placeholder link
    benefits: ['Sustainable farming', 'Improved water efficiency', 'New crop varieties for extreme weather'],
    eligibility: ['Farmers in identified climate-vulnerable regions.'],
  },
  {
    id: 'scheme8',
    name: 'Agri-Tech Startup Incubation Grant',
    description: 'A new grant program to support agricultural technology startups focusing on innovative solutions for small and marginal farmers.',
    launchDate: 'May 2024',
    status: 'newly-launched',
    link: 'https://example.gov.in/agri-tech-grants', // Placeholder link
    benefits: ['Funding for innovation', 'Job creation in rural areas', 'Development of farmer-centric tech'],
    eligibility: ['Registered Agri-Tech startups with a valid business plan.'],
  },
];
// --- END MOCK DATA FOR FARMER SCHEMES ---

type SchemeCategory = 'previous' | 'upcoming'; // For scheme categories

const ReminderScreen = () => {
  // States for Farmer Schemes
  const [selectedSchemeCategory, setSelectedSchemeCategory] = useState<SchemeCategory>('upcoming');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeError, setSchemeError] = useState<string | null>(null);

  // useEffect for Farmer Schemes data
  useEffect(() => {
    setSchemeLoading(true);
    setSchemeError(null);
    setTimeout(() => {
      let filteredSchemes: Scheme[] = [];
      if (selectedSchemeCategory === 'previous') {
        filteredSchemes = mockSchemes.filter(s => s.status === 'previous');
      } else { // 'upcoming'
        filteredSchemes = mockSchemes.filter(s => s.status === 'upcoming' || s.status === 'newly-launched');
      }

      if (filteredSchemes.length > 0) {
        setSchemes(filteredSchemes);
      } else {
        setSchemes([]);
        setSchemeError(`No ${selectedSchemeCategory === 'upcoming' ? 'upcoming or newly launched' : 'previous'} schemes found at this time.`);
      }
      setSchemeLoading(false);
    }, 700); // Simulate network delay
  }, [selectedSchemeCategory]);


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

          {/* --- Farmer Schemes Section --- */}
          <View style={styles.sectionWrapper}> {/* Reusing sectionWrapper, no longer specific to schemeSectionWrapper */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Farmer Schemes</Text>
              <Text style={styles.headerSubtitle}>Government Initiatives for Farmers</Text>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryTab,
                  selectedSchemeCategory === 'upcoming' && styles.activeCategoryTab,
                ]}
                onPress={() => setSelectedSchemeCategory('upcoming')}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedSchemeCategory === 'upcoming' && styles.activeCategoryTabText,
                ]}>
                  New Schemes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryTab,
                  selectedSchemeCategory === 'previous' && styles.activeCategoryTab,
                ]}
                onPress={() => setSelectedSchemeCategory('previous')}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedSchemeCategory === 'previous' && styles.activeCategoryTabText,
                ]}>
                  Previous Schemes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Schemes Data Display */}
            {schemeLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading schemes...</Text>
              </View>
            )}

            {schemeError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{schemeError}</Text>
              </View>
            )}

            {!schemeLoading && !schemeError && schemes.length > 0 && (
              <View style={styles.listContainer}>
                {schemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </View>
            )}

            {!schemeLoading && !schemeError && schemes.length === 0 && (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No {selectedSchemeCategory === 'upcoming' ? 'upcoming or newly launched' : 'previous'} schemes available at the moment.
                </Text>
                <Text style={styles.noDataHint}>Please check back later for updates.</Text>
              </View>
            )}
          </View>
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
    paddingBottom: 100, // Provides space above tab bar
    alignItems: 'center',
  },
  // Reusable Header Style
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

  // Removed sectionLabel, pickerContainer, pickerWrapper, picker, pickerItemIOS (Crop Calendar specific)
  // Removed cropCard, cropCardHeader, cropIcon, cropName, cropDetails, detailRow, detailLabel, detailValue (Crop Calendar specific)

  // Category Tabs (for Farmer Schemes)
  categoryTabsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeCategoryTab: {
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3C34',
    padding: 4,
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // General Status/Loading/Error/No Data Styles (reusable)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#1A3C34',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
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
  noDataContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
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
  sectionWrapper: { // Now applies directly to the single schemes section
    width: '100%',
    marginBottom: 30,
  },
  listContainer: { // Generic list container for schemes
    width: '100%',
    paddingBottom: 20,
  },
});

export default ReminderScreen;