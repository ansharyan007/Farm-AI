// screens/SettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Sign out cancelled"),
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: async () => {
            console.log("User signed out!");
            try {
                await AsyncStorage.removeItem('userToken');
            } catch (e) {
                console.error("Failed to remove token:", e);
            }

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              })
            );
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const navigateTo = (screenName: string, params?: object) => {
    console.log(`Navigating to: ${screenName}`);
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName, params);
    } else {
      Alert.alert("Navigation Error", "Navigation prop not found or screen not defined.");
    }
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
        {/* Header without back button */}
        <View style={styles.header}>
          {/* Back button removed */}
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.settingsContent}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo('EditProfile')}>
              <Text style={[styles.settingIcon, { color: '#FBBF24' }]}>👤</Text>
              <Text style={styles.settingText}>Edit Profile</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo('ChangePassword')}>
              <Text style={[styles.settingIcon, { color: '#F59E0B' }]}>🔑</Text>
              <Text style={styles.settingText}>Change Password</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Notifications', 'Go to notification settings')}>
              <Text style={[styles.settingIcon, { color: '#3B82F6' }]}>🔔</Text>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Language', 'Change app language')}>
              <Text style={[styles.settingIcon, { color: '#EF4444' }]}>🌐</Text>
              <Text style={styles.settingText}>Language</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Units of Measurement', 'Change measurement units')}>
              <Text style={[styles.settingIcon, { color: '#8B5CF6' }]}>📏</Text>
              <Text style={styles.settingText}>Units of Measurement</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Legal & About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal & About</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Privacy Policy', 'Show privacy policy')}>
              <Text style={[styles.settingIcon, { color: '#6B7280' }]}>📄</Text>
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Terms of Service', 'Show terms of service')}>
              <Text style={[styles.settingIcon, { color: '#6B7280' }]}>⚖️</Text>
              <Text style={styles.settingText}>Terms of Service</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Help & Support', 'Get help and support')}>
              <Text style={[styles.settingIcon, { color: '#FBBF24' }]}>❓</Text>
              <Text style={styles.settingText}>Help & Support</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
            <View style={styles.settingItem}>
              <Text style={[styles.settingIcon, { color: '#9CA3AF' }]}>📱</Text>
              <Text style={styles.settingText}>App Version</Text>
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              {/* <Text style={styles.signOutIcon}>👋</Text> */}
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
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
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginBottom:15,
    // Removed marginBottom, rely on scrollViewContent paddingBottom for spacing
  },
  header: {
    width: '90%',
    alignSelf:'center',
    flexDirection: 'row', // Keep flexDirection for centering
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    marginBottom: 25,
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 15,
  },
  // backButton and headerIcon styles are now unused as the back button is removed
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    // Removed marginBottom as it's not needed with text-align center and no other elements
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    // Removed flex: 1 and marginRight as it's now perfectly centered
    textAlign: 'center',
  },
  settingsContent: {
    padding: 20,
    paddingBottom: 40, // Ensures space at the bottom of the scroll view
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: 'transparent',
  },
  settingIcon: {
    marginRight: 15,
    width: 28,
    textAlign: 'center',
    fontSize: 20,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  chevronIcon: {
    fontSize: 20,
    color: '#777',
  },
  appVersion: {
    fontSize: 14,
    color: '#888',
  },
  signOutButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 0, // Keep consistent spacing after sections
    // Removed marginBottom to let scrollViewContent's paddingBottom handle end spacing
    elevation: 5,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  signOutIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;