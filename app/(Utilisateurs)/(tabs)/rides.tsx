import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";

const Rides = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Text>Courses</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Rides;
