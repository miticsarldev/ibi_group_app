import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <Text>Explore</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
