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
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocationPicker } from '@/components/location-picker';
import { Radii, Spacing } from '@/constants/theme';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, clearProfile } = useUser();
  const colors = useThemeColors();
  
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.homeAddress?.address ?? '');
  const [addressLat, setAddressLat] = useState(user?.homeAddress?.latitude ?? 43.7315);
  const [addressLon, setAddressLon] = useState(user?.homeAddress?.longitude ?? -79.7624);
  const [servingSize, setServingSize] = useState(user?.servingSize?.toString() ?? '1');
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
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedText}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="(647) 555-1234"
                placeholderTextColor={colors.mutedText}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Serving Size</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={servingSize}
                onChangeText={setServingSize}
                placeholder="1"
                placeholderTextColor={colors.mutedText}
                keyboardType="number-pad"
              />
              <Text style={[styles.fieldHint, { color: colors.mutedText }]}>Number of people (1-3)</Text>
            </View>
          </View>

          {/* Home Address */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Home Address</Text>
            <LocationPicker
              address={address}
              onAddressChange={setAddress}
              onLocationChange={(lat, lon) => {
                setAddressLat(lat);
                setAddressLon(lon);
              }}
              initialLatitude={addressLat}
              initialLongitude={addressLon}
            />
          </View>

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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  field: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
  },
  fieldHint: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  saveButton: {
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  dangerButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
