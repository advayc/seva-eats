import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Radii, Spacing } from '@/constants/theme';
import { getMealById } from '@/constants/meals';
import { useLocation, useRequests, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

const SERVING_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const MAX_NOTE_LENGTH = 200;

export default function DeliveryDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ meals: string }>();
  const { userLocation } = useLocation();
  const { user } = useUser();
  const { submitRequest, activeRequest } = useRequests();
  const colors = useThemeColors();

  // Parse selected meals from URL params
  const selectedMeals = useMemo(() => {
    if (!params.meals) return [];
    return params.meals.split(',').map((item) => {
      const [id, qty] = item.split(':');
      const meal = getMealById(id);
      return meal ? { meal, quantity: parseInt(qty, 10) } : null;
    }).filter(Boolean) as { meal: NonNullable<ReturnType<typeof getMealById>>; quantity: number }[];
  }, [params.meals]);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(userLocation?.address ?? '');
  const [servingSize, setServingSize] = useState(user?.servingSize ?? 2);
  const [driverNote, setDriverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const driverNoteCount = driverNote.length;

  const handleSubmit = () => {
    // Validate
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Phone Required', 'Please enter your phone number so the driver can contact you.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your delivery address.');
      return;
    }

    // Check for existing active request
    if (activeRequest) {
      Alert.alert(
        'Request in Progress',
        'You already have an active meal request. Please wait for it to be completed.',
        [
          { text: 'View Request', onPress: () => router.push(`/request/${activeRequest.id}` as any) },
          { text: 'OK', style: 'cancel' },
        ]
      );
      return;
    }

    setIsSubmitting(true);

    // Create meal description from selections
    const mealDescription = selectedMeals
      .map((item) => `${item.quantity}x ${item.meal.name}`)
      .join(', ');

    const request = submitRequest({
      recipientName: name.trim(),
      recipientPhone: phone.trim(),
      deliveryAddress: {
        address: address.trim(),
        latitude: userLocation?.latitude ?? 43.7315,
        longitude: userLocation?.longitude ?? -79.7624,
      },
      servingSize,
      dietaryRestrictions: [],
      driverNote: `Meals: ${mealDescription}${driverNote ? `\n${driverNote.trim()}` : ''}`,
    });

    setIsSubmitting(false);
    router.replace(`/request/${request.id}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Delivery Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected Meals Summary */}
          <Animated.View entering={FadeIn.delay(100)} style={[styles.mealsSummary, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Your Order</Text>
            {selectedMeals.map((item) => (
              <View key={item.meal.id} style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: item.meal.backgroundColor }]}>
                  <MaterialIcons
                    name={item.meal.icon as any}
                    size={16}
                    color={item.meal.iconColor}
                  />
                </View>
                <Text style={[styles.summaryMealName, { color: colors.text }]}>{item.meal.name}</Text>
                <Text style={[styles.summaryQuantity, { color: colors.accent }]}>x{item.quantity}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Name Input */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Your Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor={colors.mutedText}
            />
          </Animated.View>

          {/* Phone Input */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={colors.mutedText}
            />
            <Text style={[styles.helper, { color: colors.mutedText }]}>The driver will call/text when they arrive</Text>
          </Animated.View>

          {/* Address Input */}
          <Animated.View entering={FadeInDown.delay(250)} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Delivery Address</Text>
            <View style={[styles.addressInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialIcons name="location-on" size={20} color={colors.accent} />
              <TextInput
                style={[styles.addressInput, { color: colors.text }]}
                placeholder="Enter your delivery address"
                value={address}
                onChangeText={setAddress}
                multiline
                placeholderTextColor={colors.mutedText}
              />
            </View>
            {userLocation?.address && address !== userLocation.address && (
              <Pressable
                style={styles.useCurrentButton}
                onPress={() => setAddress(userLocation.address!)}
              >
                <MaterialIcons name="my-location" size={16} color={colors.accent} />
                <Text style={[styles.useCurrentText, { color: colors.accent }]}>Use current location</Text>
              </Pressable>
            )}
          </Animated.View>

          {/* Serving Size */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Serving Size</Text>
            <Text style={[styles.helper, { color: colors.mutedText }]}>How many servings should we prepare?</Text>
            <View style={styles.familySizeRow}>
              {SERVING_SIZES.map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.familySizeButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    servingSize === size && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                  onPress={() => setServingSize(size)}
                >
                  <Text
                    style={[
                      styles.familySizeText,
                      { color: colors.text },
                      servingSize === size && { color: '#FFFFFF' },
                    ]}
                  >
                    {size}{size === 8 ? '+' : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Add Note to Driver */}
          <Animated.View entering={FadeInDown.delay(350)} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Add Note to Driver</Text>
            <Text style={[styles.helper, { color: colors.mutedText }]}>Notes for your driver (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., leave at door, call on arrival"
              value={driverNote}
              onChangeText={(text) => setDriverNote(text.slice(0, MAX_NOTE_LENGTH))}
              multiline
              numberOfLines={3}
              maxLength={MAX_NOTE_LENGTH}
              placeholderTextColor={colors.mutedText}
            />
            <View style={styles.noteFooter}>
              <Text style={[styles.noteHint, { color: colors.mutedText }]}>Be respectful. Notes are visible to drivers.</Text>
              <Text style={[styles.noteCount, { color: colors.mutedText }]}>{driverNoteCount}/{MAX_NOTE_LENGTH}</Text>
            </View>
          </Animated.View>

          {/* Spacer for bottom button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.accent }, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <MaterialIcons name="restaurant" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Request Meal'}
            </Text>
          </Pressable>
        </View>
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
    fontSize: 17,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  mealsSummary: {
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryMealName: {
    flex: 1,
    fontSize: 14,
  },
  summaryQuantity: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  helper: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: Radii.md,
    padding: Spacing.md,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteFooter: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteHint: {
    fontSize: 11,
  },
  noteCount: {
    fontSize: 11,
  },
  addressInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  addressInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  useCurrentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  useCurrentText: {
    fontSize: 13,
    fontWeight: '500',
  },
  familySizeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  familySizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  familySizeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
