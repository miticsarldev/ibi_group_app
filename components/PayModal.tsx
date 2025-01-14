import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig"; 
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 

type PayModalProps = {
  visible: boolean;
  onClose: () => void;
  type: string;
  price: string;
  destination: string;
  userLocation: { latitude: number; longitude: number; address: string } | null;
};

const PayModal: React.FC<PayModalProps> = ({
  visible,
  onClose,
  type,
  price,
  destination,
  userLocation
}) => {
  const handlePayment = async () => {
    const tripData = {
      destination,
      type,
      price,
      userLocation,
      status: "Encours",
      createdAt: serverTimestamp(), 
    };

    try {
     
      await addDoc(collection(db, "trajet"), tripData);
      console.log("Données du trajet envoyées avec succès !");
      onClose(); 
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmez votre paiement</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Destination : {destination}</Text>
            <Text style={styles.infoText}>Type de véhicule : {type}</Text>
            <Text style={styles.infoText}>Prix : {price}</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
            <Text style={styles.confirmButtonText}>Confirmer et Payer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Annuler</Text>
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
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
  },
});

export default PayModal;