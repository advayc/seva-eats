import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function KitchenLoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [code, setCode] = useState('');

  const handleContinue = () => {
    if (!code.trim()) return;
    router.replace('/kitchen/meal-ready' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="storefront" size={40} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Kitchen Login</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>Enter the gurdwara access code</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Access code</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
            placeholderTextColor={colors.mutedText}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }, !code.trim() && styles.primaryButtonDisabled]}
            onPress={handleContinue}
            disabled={!code.trim()}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={() => router.push('/role-switch' as any)}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Switch role</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    marginTop: Spacing.xl,
  },
  actions: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: Spacing.md,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
