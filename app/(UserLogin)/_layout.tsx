import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connexion" />
      <Stack.Screen name="Inscription" />
      <Stack.Screen name="Home" />
    </Stack>
  );
}
