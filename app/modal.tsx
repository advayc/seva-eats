import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { categories } from '@/constants/mock-data';
import { Colors, Radii, Spacing } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/" dismissTo asChild>
          <Pressable style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.light.text} />
          </Pressable>
        </Link>
        <Text style={styles.title}>All categories</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.item}>
              <View style={styles.iconWrap}>
                <MaterialIcons name={category.icon as never} size={26} color={Colors.light.text} />
              </View>
              <Text style={styles.label}>{category.name}</Text>
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
    backgroundColor: Colors.light.background,
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
    borderColor: Colors.light.border,
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
    color: Colors.light.text,
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
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: Colors.light.text,
    textAlign: 'center',
  },
});
