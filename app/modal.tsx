import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '@/constants/mock-data';
import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ModalScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Link href="/" dismissTo asChild>
          <Pressable style={[styles.backButton, { borderColor: colors.border }]}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
        </Link>
        <Text style={[styles.title, { color: colors.text }]}>All categories</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.item}>
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
                <MaterialIcons name={category.icon as never} size={26} color={colors.text} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.lg,
  },
  item: {
    width: '23%',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
