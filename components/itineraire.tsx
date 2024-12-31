import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LocationInput = ({
  initialLocation,
  knownCoordinates,
  handlePress,
}: {
  initialLocation: string;
  knownCoordinates: { latitude: number; longitude: number };
  handlePress: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Destination :</Text>
        <Text style={styles.locationText}>{initialLocation}</Text>
      </View> 
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            handlePress({
              latitude: knownCoordinates.latitude,
              longitude: knownCoordinates.longitude,
              address: initialLocation,
            })
          }
        >
          <Text style={styles.buttonText}>Créer l'itinéraire</Text>
        </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 55,
    marginBottom: 10,
    padding: 5,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#d4d4d4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flexShrink: 1,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#0890FE",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "200",
    fontSize: 14,
    textAlign: "center"
  },
});

export default LocationInput;


