import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Assurez-vous d'avoir installé @expo/vector-icons

const CustomCheckbox = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.checkboxContainer}>
      <MaterialIcons
        name={value ? "check-box" : "check-box-outline-blank"}
        size={24}
        color={value ? "#28a745" : "#ccc"}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default CustomCheckbox;