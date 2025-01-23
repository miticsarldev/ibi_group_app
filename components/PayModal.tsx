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
import { db, auth, database } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { icons, images } from "@/constants"; 

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
  userLocation,
}) => {
  const [otp, setOtp] = useState<string | null>(null);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handlePayment = async () => {
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté.");
      return;
    }

    const tripData = {
      destination,
      type,
      price,
      userLocation,
      otp: generatedOtp,
      status: "Encours",
      createdAt: serverTimestamp(),
      userId: user.uid,
    };

    try {
      await addDoc(collection(db, "trajet"), tripData);
      console.log("Données du trajet envoyées avec succès à Firestore !");

      const tripRef = ref(database, `trajets/${user.uid}/${Date.now()}`);
      await set(tripRef, tripData);

      setIsOtpGenerated(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      Alert.alert("Erreur", "Impossible de créer le trajet. Veuillez réessayer.");
    }
  };

  const closeModal = () => {
    setIsOtpGenerated(false);
    setOtp(null);
    onClose();
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
          {!isOtpGenerated ? (
            <>
              <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                <Image source={icons.close} style={styles.closeIconImage} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Confirmez votre paiement</Text>
              <View style={styles.infoContainer}>
                <Image source={icons.des} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Destination:</Text>
                </View>
                <Text style={styles.value}>{destination}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Image source={type === "Voiture" ? images.mobil : images.moto} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Type de véhicule:</Text>
                </View>
                <Text style={styles.value}>{type}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Image source={icons.prix} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Prix:</Text>
                </View>
                <Text style={styles.value}>{price}</Text>
              </View>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handlePayment}
              >
                <Text style={styles.confirmButtonText}>Confirmer et Payer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Trajet confirmé</Text>
              <Text style={styles.otpText}>
                Code OTP pour le chauffeur :{" "}
                <Text style={styles.otp}>{otp}</Text>
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </>
          )}
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
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
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
  otpText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  otp: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeIconImage: {
    marginTop: 20,
    width: 24,
    height: 24,
  },
});

export default PayModal;