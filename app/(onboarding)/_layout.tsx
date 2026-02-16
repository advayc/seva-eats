import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="learn-more" />
      {/* choose-role intentionally omitted from stack to keep it hidden; access only via deliberate deep link like: myapp://(onboarding)/choose-role?access=allow */}
    </Stack>
  );
}
