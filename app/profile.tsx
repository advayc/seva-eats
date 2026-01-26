import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useUser } from '@/context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, clearProfile, hasCompletedProfile } = useUser();
  
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.homeAddress?.address ?? '');
  const [familySize, setFamilySize] = useState(user?.familySize?.toString() ?? '1');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter your phone number');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        homeAddress: address.trim() ? {
          address: address.trim(),
          latitude: 43.7315, // Default coordinates (would use geocoding in production)
          longitude: -79.7624,
        } : user?.homeAddress ?? null,
        familySize: parseInt(familySize, 10) || 1,
        notificationsEnabled,
      });
      Alert.alert('Saved', 'Your profile has been updated', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset your profile and all request history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            router.back();
          }
        },
      ]
    );
  };

  const roleLabels = {
    volunteer: 'Volunteer Only',
    recipient: 'Recipient Only',
    both: 'Both',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={48} color={Colors.light.accent} />
            </View>
            {hasCompletedProfile && (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={16} color="#059669" />
                <Text style={styles.completedText}>Profile Complete</Text>
              </View>
            )}
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.light.mutedText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={Colors.light.mutedText}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Home Address</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                placeholderTextColor={Colors.light.mutedText}
              />
              <Text style={styles.inputHint}>
                Used to find nearby Gurdwaras and drop-off locations
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Family Size</Text>
              <View style={styles.counterRow}>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => setFamilySize(Math.max(1, parseInt(familySize, 10) - 1).toString())}
                >
                  <MaterialIcons name="remove" size={20} color={Colors.light.accent} />
                </Pressable>
                <Text style={styles.counterValue}>{familySize}</Text>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => setFamilySize((parseInt(familySize, 10) + 1).toString())}
                >
                  <MaterialIcons name="add" size={20} color={Colors.light.accent} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I want to...</Text>
            <View style={styles.roleOptions}>
              {(['volunteer', 'recipient', 'both'] as const).map((role) => (
                <Pressable
                  key={role}
                  style={[
                    styles.roleOption,
                    user?.role === role && styles.roleOptionSelected,
                  ]}
                  onPress={() => updateProfile({ role })}
                >
                  <MaterialIcons 
                    name={role === 'volunteer' ? 'volunteer-activism' : role === 'recipient' ? 'restaurant' : 'swap-horiz'} 
                    size={24} 
                    color={user?.role === role ? '#FFFFFF' : Colors.light.accent} 
                  />
                  <Text style={[
                    styles.roleOptionText,
                    user?.role === role && styles.roleOptionTextSelected,
                  ]}>
                    {roleLabels[role]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Get updates on deliveries and requests</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: Colors.light.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Stats (if user has activity) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Impact</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Deliveries Made</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Meals Received</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Pressable 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </Pressable>

            <Pressable style={styles.dangerButton} onPress={handleClearData}>
              <MaterialIcons name="delete-outline" size={20} color="#DC2626" />
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </Pressable>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Seva Eats v1.0.0</Text>
            <Text style={styles.appInfoText}>Made with love for the community</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.mutedText,
    marginBottom: Spacing.xs,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginTop: Spacing.xs,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 30,
    textAlign: 'center',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  roleOptionSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  roleOptionText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  settingDesc: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginTop: Spacing.xs,
  },
  saveButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: Radii.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appInfoText: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginBottom: 4,
  },
});
