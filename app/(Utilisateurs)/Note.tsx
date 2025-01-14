import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const RateDoctorScreen = ({ onSubmitRating, onSkip }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <View style={styles.container}>
      {/* Icône de confirmation */}
      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/image/sucess.png")} // Remplacez avec le chemin de votre icône
          style={styles.successIcon}
        />
      </View>
      {/* Texte principal */}
      <Text style={styles.title}>Vous êtes arrivé à destination</Text>
      <Text style={styles.subtitle}>Merci d'avoir choisi IBI GROUP</Text>
      
      {/* Emoticônes de notation */}
      <Text style={styles.ratingPrompt}>Voulez-vous noter ce trajet ?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => handleRating(rating)}
            style={[
              styles.ratingIcon,
              selectedRating === rating && styles.selectedRatingIcon,
            ]}
          >
            <Text style={styles.emoji}>
              {rating === 1
                ? "😡"
                : rating === 2
                ? "😕"
                : rating === 3
                ? "😊"
                : rating === 4
                ? "😃"
                : "😁"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => onSubmitRating(selectedRating)}
          disabled={selectedRating === null}
        >
          <Text style={styles.buttonText}>Noter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.buttonText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  ratingPrompt: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  ratingIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  selectedRatingIcon: {
    backgroundColor: "#28a745",
  },
  emoji: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  skipButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RateDoctorScreen;
