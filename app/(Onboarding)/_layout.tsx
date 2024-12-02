import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Screen1" />
      <Stack.Screen name="Screen2" />
      <Stack.Screen name="Bienvenue" />
    </Stack>
  );
}
