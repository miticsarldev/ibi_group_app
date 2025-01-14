import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import PriceModal from "./PriceModal";

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  userLocation: { latitude: number; longitude: number; address: string } | null;
  onDestinationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  onDestinationSelect,
  userLocation,
}) => {
  const [priceModalVisible, setPriceModalVisible] = useState(false);

  const openPriceModal = () => {
    onClose(); // Ferme le CustomModal
    setTimeout(() => {
      setPriceModalVisible(true); // Ouvre le PriceModal
    }, 300); // Délai pour éviter les conflits visuels
  };

  const closePriceModal = () => {
    setPriceModalVisible(false);
  };

  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  
  return (
    <>
      {/* Main Custom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Image source={icons.close} style={styles.closeImage} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choisissez votre adresse</Text>

            {/* Current Location Input */}
            <View style={styles.inputContainer}>
              <Image source={icons.location} style={styles.inputIcon} />
              <Text style={styles.inputText}>Votre position</Text>
            </View>

            {/* Destination Input */}
            <GoogleTextInput
              icon={icons.search}
              handlePress={(location) => {
                setSelectedDestination(location.address); // Stocke l'adresse sélectionnée
                onDestinationSelect(location); // Passe les données au parent si nécessaire
              }}
              containerStyle={styles.destinationInput}
              textInputBackgroundColor="#f5f5f5"
            />
          <Text style={styles.noAddressText}>
            {selectedDestination ? selectedDestination : "Aucune adresse choisie"}
          </Text>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={openPriceModal}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Price Modal */}
      <PriceModal
        visible={priceModalVisible}
        onClose={closePriceModal}
        destination={selectedDestination || ""} 
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  closeImage: {
    width: 20,
    height: 20,
    tintColor: "#333",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#666",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
  },
  destinationInput: {
    width: "100%",
  },
  noAddressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#aaa",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 120,
    borderRadius: 30,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomModal;
