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

import { LocationPicker } from '@/components/location-picker';
import { Radii, Spacing } from '@/constants/theme';
import { useLocation, useTheme, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, clearProfile, hasCompletedProfile } = useUser();
  const { themeMode, setThemeMode } = useTheme();
  const { userLocation } = useLocation();
  const colors = useThemeColors();
  
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.homeAddress?.address ?? '');
  const [addressLat, setAddressLat] = useState(user?.homeAddress?.latitude ?? 43.7315);
  const [addressLon, setAddressLon] = useState(user?.homeAddress?.longitude ?? -79.7624);
  const [servingSize, setServingSize] = useState(user?.servingSize?.toString() ?? '1');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const servingSizeValue = Math.min(3, Math.max(1, parseInt(servingSize, 10) || 1));

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
          latitude: addressLat,
          longitude: addressLon,
        } : user?.homeAddress ?? null,
        servingSize: servingSizeValue,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
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
            <View style={[styles.avatar, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED' }]}>
              <MaterialIcons name="person" size={48} color={colors.accent} />
            </View>
            {hasCompletedProfile && (
              <View style={[styles.completedBadge, { backgroundColor: colors.isDark ? 'rgba(5, 150, 105, 0.2)' : '#ECFDF5' }]}>
                <MaterialIcons name="check-circle" size={16} color={colors.isDark ? '#34D399' : '#059669'} />
                <Text style={[styles.completedText, { color: colors.isDark ? '#34D399' : '#059669' }]}>Profile Complete</Text>
              </View>
            )}
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Full Name</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={colors.mutedText}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Address</Text>
              <LocationPicker
                address={address}
                onAddressChange={setAddress}
                onLocationChange={(lat, lon) => {
                  setAddressLat(lat);
                  setAddressLon(lon);
                }}
                initialLatitude={addressLat}
                initialLongitude={addressLon}
                currentAddress={userLocation?.address}
                currentLat={userLocation?.latitude}
                currentLon={userLocation?.longitude}
                placeholder="Enter a shelter or partner location"
              />
              <Text style={[styles.inputHint, { color: colors.mutedText }]}>
                Used to find nearby partner shelters during the beta
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Serving Size</Text>
              <View style={styles.counterRow}>
                <Pressable 
                  style={[styles.counterButton, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED' }]}
                  onPress={() => setServingSize(Math.max(1, servingSizeValue - 1).toString())}
                >
                  <MaterialIcons name="remove" size={20} color={colors.accent} />
                </Pressable>
                <Text style={[styles.counterValue, { color: colors.text }]}>{servingSizeValue}</Text>
                <Pressable 
                  style={[styles.counterButton, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED' }]}
                  onPress={() => setServingSize(Math.min(3, servingSizeValue + 1).toString())}
                >
                  <MaterialIcons name="add" size={20} color={colors.accent} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Roles</Text>
            <Text style={[styles.inputHint, { color: colors.mutedText }]}>Switch modes from the role chooser.</Text>
              <Pressable
                style={[styles.roleButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => router.push('/(onboarding)/choose-role' as any)}
              >
                <MaterialIcons name="swap-horiz" size={20} color={colors.accent} />
                <Text style={[styles.roleButtonText, { color: colors.text }]}>Switch role</Text>
              </Pressable>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
            <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDesc, { color: colors.mutedText }]}>Get updates on deliveries and requests</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            <View style={styles.themeOptions}>
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <Pressable
                  key={mode}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor: themeMode === mode ? colors.accent : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <MaterialIcons 
                    name={mode === 'light' ? 'light-mode' : mode === 'dark' ? 'dark-mode' : 'brightness-auto'} 
                    size={20} 
                    color={themeMode === mode ? '#FFFFFF' : colors.text}
                  />
                  <Text style={[styles.themeButtonText, { color: themeMode === mode ? '#FFFFFF' : colors.text }]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Stats (if user has activity - volunteers only) */}
          {user?.role === 'dasher' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Impact</Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.statNumber, { color: colors.accent }]}>0</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedText }]}>Deliveries Made</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.statNumber, { color: colors.accent }]}>0</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedText }]}>Meals Received</Text>
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.section}>
            <Pressable 
              style={[styles.saveButton, { backgroundColor: colors.accent }, isSaving && styles.saveButtonDisabled]}
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
            <Text style={[styles.appInfoText, { color: colors.mutedText }]}>Seva Eats v1.0.0</Text>
            <Text style={[styles.appInfoText, { color: colors.mutedText }]}>Made with love for the community</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  textInput: {
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 15,
    borderWidth: 1,
  },
  inputHint: {
    fontSize: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  saveButton: {
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
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
