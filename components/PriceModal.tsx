import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { images } from "@/constants"; // Remplacez par votre chemin réel des icônes
import PayModal from "./PayModal";

type PriceModalProps = {
  visible: boolean;
  onClose: () => void;
};

const PriceModal: React.FC<PriceModalProps> = ({ visible, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);

  const handleSelectOption = (type: string, price: string) => {
    setSelectedType(type);
    setSelectedPrice(price);
    onClose(); // Ferme la modal de prix
    setTimeout(() => setIsPayModalVisible(true), 300); // Ouvre la modal de paiement après une courte attente
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

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleSelectOption("Voiture", "1500 FCFA")}
            >
              <View style={styles.optionDetails}>
                <Image source={images.mobil} style={styles.optionIcon} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>Voiture</Text>
                  <Text style={styles.optionDescription}>
                    Voiture électrique confortable
                  </Text>
                </View>
              </View>
              <Text style={styles.priceText}>1500 FCFA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleSelectOption("Moto", "1000 FCFA")}
            >
              <View style={styles.optionDetails}>
                <Image source={images.moto} style={styles.optionIcon} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>Moto</Text>
                  <Text style={styles.optionDescription}>
                    Rapide et sécurisée
                  </Text>
                </View>
              </View>
              <Text style={styles.priceText}>1000 FCFA</Text>
            </TouchableOpacity>

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
    alignItems:'center',
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
