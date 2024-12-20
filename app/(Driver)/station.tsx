import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { router } from "expo-router";

const StationsScreen = () => {
  const handleNext = () => {
    router.navigate('/(Driver)/stationItineraire'); 
  }
  const stations = [
    { name: "Kati Sanafa", time: "10mns" },
    { name: "Hamdallaye", time: "13mns" },
    { name: "Banco", time: "30mns" },
    { name: "Yirimadjo", time: "20mns" },
  ];

  const renderStation = ({ item }: { item: { name: string; time: string } }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationInfo}>
        <View style={styles.imageContain} >
          <Image source={require("../../assets/image/flash.png")} style={styles.stationIcon} />
        </View>
        <View> 
          <Text style={styles.stationName}>{item.name}</Text>
          <Text style={styles.stationTime}> à {item.time}</Text>
        </View>
      </View>
      <Ionicons name="location" size={24} color="#10B981" onPress={handleNext} />
    </View>
  );

  return (
    <View style={styles.container} >
       

      {/* Station List */}
      <FlatList
        data={stations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderStation}
        contentContainerStyle={styles.listContainer} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", 
  },
  listContainer: {
    padding: 16,
    paddingTop: 40,
  },
  stationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15, 
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  stationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContain: {
    backgroundColor: "#C8E6C9",
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: -2

  },
  stationIcon: { 
    height: 20, 
    marginLeft:5
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  stationTime: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default StationsScreen;
