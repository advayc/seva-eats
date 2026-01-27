import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

const DIET_TAGS = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'];

export default function MealReadyScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [mealCount, setMealCount] = useState('');
  const [readyTime, setReadyTime] = useState('12:30 PM');
  const [items, setItems] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!mealCount.trim()) return;
    router.replace('/dispatcher/dashboard' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="inventory-2" size={32} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Meals Ready</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>Share today’s prepared meals with the dispatcher</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Meal count</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g., 60"
            value={mealCount}
            onChangeText={(value) => setMealCount(value.replace(/[^0-9]/g, '').slice(0, 3))}
            keyboardType="numeric"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Ready time</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="12:30 PM"
            value={readyTime}
            onChangeText={setReadyTime}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Food items</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g., chana masala, rice, roti"
            value={items}
            onChangeText={setItems}
            placeholderTextColor={colors.mutedText}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Dietary tags</Text>
          <View style={styles.tagRow}>
            {DIET_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    selected && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text }, selected && { color: '#FFFFFF' }]}>{tag}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }, !mealCount.trim() && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={!mealCount.trim()}
          >
            <Text style={styles.primaryText}>Send to dispatcher</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.replace('/kitchen/login' as any)}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>Back to login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: Spacing.md,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: Spacing.lg,
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actions: {
    gap: Spacing.sm,
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
