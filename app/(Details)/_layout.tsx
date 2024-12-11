import { Stack } from 'expo-router';

export default function DetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DetPage"/>
      <Stack.Screen name="Destination"/>
    </Stack>
  );
}
