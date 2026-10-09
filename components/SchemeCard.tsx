// SchemeCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
// Removed: import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the type for a single scheme
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

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const handlePressLink = () => {
    if (scheme.link) {
      Linking.openURL(scheme.link).catch(err => console.error("Couldn't load page", err));
    }
  };

  const getStatusColor = (status: Scheme['status']) => {
    switch (status) {
      case 'previous': return '#757575'; // Grey
      case 'upcoming': return '#FF9800'; // Orange
      case 'newly-launched': return '#4CAF50'; // Green (similar to your app's theme)
      default: return '#757575';
    }
  };

  const getStatusLabel = (status: Scheme['status']) => {
    switch (status) {
      case 'previous': return 'Previous';
      case 'upcoming': return 'Upcoming';
      case 'newly-launched': return 'Newly Launched';
      default: return 'Status';
    }
  };

  // Emojis for benefits and eligibility
  const benefitEmoji = '✔️';
  const eligibilityEmoji = '👨‍🌾';
  const linkEmoji = '🔗';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.schemeName}>{scheme.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(scheme.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(scheme.status)}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Launch Date:</Text>
        <Text style={styles.detailValue}>{scheme.launchDate}</Text>
      </View>

      <Text style={styles.description}>{scheme.description}</Text>

      {scheme.benefits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Benefits:</Text>
          {scheme.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              {/* Using emoji instead of icon */}
              <Text style={styles.listItemIcon}>{benefitEmoji}</Text>
              <Text style={styles.listItemText}>{benefit}</Text>
            </View>
          ))}
        </View>
      )}

      {scheme.eligibility.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility:</Text>
          {scheme.eligibility.map((criteria, index) => (
            <View key={index} style={styles.listItem}>
              {/* Using emoji instead of icon */}
              <Text style={styles.listItemIcon}>{eligibilityEmoji}</Text>
              <Text style={styles.listItemText}>{criteria}</Text>
            </View>
          ))}
        </View>
      )}

      {scheme.link && (
        <TouchableOpacity style={styles.linkButton} onPress={handlePressLink}>
          {/* Using emoji instead of icon */}
          <Text style={styles.linkButtonIcon}>{linkEmoji}</Text>
          <Text style={styles.linkButtonText}>Learn More / Apply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#29ca9f', // Highlight color
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  schemeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3C34',
    flexShrink: 1, // Allow text to wrap
    marginRight: 10,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 15,
    lineHeight: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A3C34',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  listItemIcon: { // Style for the emoji
    fontSize: 16,
    marginRight: 8,
    marginTop: 2, // Align icon better with text
  },
  listItemText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF', // Blue for links/actions
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  linkButtonIcon: { // Style for the emoji in the button
    fontSize: 18,
    color: '#fff',
    marginRight: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SchemeCard;