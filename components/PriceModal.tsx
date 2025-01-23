import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { images } from "@/constants";
import PayModal from "./PayModal";

type PriceModalProps = {
  visible: boolean;
  onClose: () => void;
  destination: string;
  userLocation: { latitude: number; longitude: number; address: string } | null;
  distance: number | null;
  duration: number | null;
};

const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  onClose,
  destination,
  userLocation,
  distance,
  duration,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);

  const calculatePrice = (distance: number, type: "moto" | "voiture"): string => {
    if (type === "moto" && distance < 1) {
      return "Distance minimale non atteinte (1 km)";
    }
    if (type === "voiture" && distance < 3) {
      return "Distance minimale non atteinte (3 km)";
    }
    
    if (distance >= 1 && distance < 5 && type === "moto") {
      return "500 FCFA"; 
    }
    if (distance >= 3 && distance < 5 && type === "voiture") {
      return "1000 FCFA"; 
    }

    
    if (distance >= 5 && distance <= 10) {
      return type === "moto" ? "1000 FCFA" : "2000 FCFA";
    } else if (distance > 10 && distance <= 15) {
      return type === "moto" ? "1250 FCFA" : "2500 FCFA";
    } else if (distance > 15 && distance <= 20) {
      return type === "moto" ? "1500 FCFA" : "3000 FCFA";
    } else if (distance > 20 && distance <= 30) {
      return type === "moto" ? "2000 FCFA" : "4500 FCFA";
    } else if (distance > 30) {
      const additionalDistance = distance - 30;
      const additionalPriceMoto = additionalDistance * 500;
      const additionalPriceVoiture = additionalDistance * 1000;
      return type === "moto"
        ? `${2000 + additionalPriceMoto} FCFA`
        : `${5000 + additionalPriceVoiture} FCFA`;
    } else {
      return "Distance trop courte pour un prix";
    }
  };

  const handleSelectOption = (type: string, price: string) => {
    if (price.includes("Distance minimale non atteinte") || price.includes("Distance trop courte")) {
      Alert.alert("Erreur", price);
      return;
    }
    setSelectedType(type);
    setSelectedPrice(price);
    onClose();
    setTimeout(() => setIsPayModalVisible(true), 300);
  };

  const handlePayModalClose = () => {
    setIsPayModalVisible(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez votre offre</Text>

            {distance !== null && (
              <>
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() =>
                    handleSelectOption(
                      "Voiture",
                      calculatePrice(distance, "voiture")
                    )
                  }
                >
                  <View style={styles.optionDetails}>
                    <Image source={images.mobil} style={styles.optionIcon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.optionTitle}>Voiture</Text>
                      <Text style={styles.optionDescription}>
                        Voiture électrique confortable
                      </Text>
                      {calculatePrice(distance, "voiture").includes("Distance minimale non atteinte") && (
                        <Text style={styles.errorText}>
                          {calculatePrice(distance, "voiture")}
                        </Text>
                      )}
                    </View>
                  </View>
                  {!calculatePrice(distance, "voiture").includes("Distance minimale non atteinte") && (
                    <Text style={styles.priceText}>
                      {calculatePrice(distance, "voiture")}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() =>
                    handleSelectOption(
                      "Moto",
                      calculatePrice(distance, "moto")
                    )
                  }
                >
                  <View style={styles.optionDetails}>
                    <Image source={images.moto} style={styles.optionIcon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.optionTitle}>Moto</Text>
                      <Text style={styles.optionDescription}>
                        Rapide et sécurisée
                      </Text>
                      {calculatePrice(distance, "moto").includes("Distance minimale non atteinte") && (
                        <Text style={styles.errorText}>
                          {calculatePrice(distance, "moto")}
                        </Text>
                      )}
                    </View>
                  </View>
                  {!calculatePrice(distance, "moto").includes("Distance minimale non atteinte") && (
                    <Text style={styles.priceText}>
                      {calculatePrice(distance, "moto")}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <Text style={styles.confirmButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PayModal
        visible={isPayModalVisible}
        onClose={handlePayModalClose}
        type={selectedType || ""}
        price={selectedPrice || ""}
        destination={destination || ""}
        userLocation={userLocation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    color: "#333",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    alignSelf: "flex-end",
  },
  errorText: {
    fontSize: 14,
    color: "#ff4444",
    marginTop: 5,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PriceModal;