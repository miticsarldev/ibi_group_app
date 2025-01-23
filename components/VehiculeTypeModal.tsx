import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { images } from "@/constants"; // Assurez-vous que vos images sont correctement définies

type VehiculeTypeModal = {
  visible: boolean;
  onClose: () => void;
  type: string;
  price: string;
};

const VehiculeTypeModal: React.FC<VehiculeTypeModal> = ({ visible, onClose, type, price }) => {
  // Logique pour sélectionner l'image en fonction du type
  const getImageForType = (vehicleType: string) => {
    switch (vehicleType) {
      case "Voiture":
        return images.mobil; // Image associée à "Voiture"
      case "Moto":
        return images.moto; // Image associée à "Moto"
      default:
        return images.mobil; // Une image par défaut si aucun type ne correspond
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Bouton de fermeture */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Mode de paiement</Text>
          <View style={styles.row}>
            {/* Image basée sur le type */}
            <Image source={getImageForType(type)} style={styles.optionIcon} />
            <View style={styles.textContainer}>
              <Text style={styles.detailText}>
                {type} - <Text style={styles.seatsText}>4 P</Text>
              </Text>
              <Text style={styles.subText}>
                {type === "Voiture"
                  ? "Voiture électrique confortable"
                  : "Rapide et sécurisée"}
              </Text>
            </View>
            <Text style={styles.priceText}>{price}</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Mode de paiement</Text>
            <Text style={styles.paymentText}>Espèces</Text>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  optionIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seatsText: {
    color: "#555",
    fontSize: 14,
  },
  subText: {
    fontSize: 12,
    color: "#777",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  paymentLabel: {
    fontSize: 16,
    color: "#555",
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VehiculeTypeModal;