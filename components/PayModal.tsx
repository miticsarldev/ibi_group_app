import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { db, auth, database } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { icons, images } from "@/constants";
import CustomCheckbox from "./CustumCheckbox";

type PayModalProps = {
  visible: boolean;
  onClose: () => void;
  type: string;
  price: string;
  destination: { latitude: number; longitude: number; address: string };
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
  const [tripStatus, setTripStatus] = useState<"idle" | "searching" | "driver_accepted">("idle");
  const [tripId, setTripId] = useState<string | null>(null);
  const [otpEntered, setOtpEntered] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>("");

  const predefinedReasons = [
    "Je n'ai plus besoin du trajet",
    "Le chauffeur met trop de temps à arriver",
    "Problème technique avec l'application",
    "Je préfère utiliser un autre moyen de transport",
  ];

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (tripStatus === "searching") {
      timeoutId = setTimeout(() => {
        setTripStatus((prevStatus) => {
          if (prevStatus === "searching") {
            Alert.alert("Recherche expirée", "Aucun chauffeur trouvé veuillez réessayer.");
            return "idle";
          }
          return prevStatus;
        });
      }, 60000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [tripStatus]);

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = onSnapshot(doc(db, "trajet", tripId), (docSnapshot) => {
      const trip = docSnapshot.data();
      if (trip) {
        if (trip.status === "accepter" && !trip.otp) {
          const generatedOtp = generateOtp();
          setOtp(generatedOtp);
          setTripStatus("driver_accepted");

          updateDoc(doc(db, "trajet", tripId), { otp: generatedOtp })
            .then(() => console.log("OTP ajouté au trajet avec succès !"))
            .catch((error) => console.error("Erreur lors de l'ajout de l'OTP :", error));
        }

        if (trip.otpEntered) {
          setOtpEntered(true);
        }
      }
    });

    return () => unsubscribe();
  }, [tripId]);

  const handlePayment = async () => {
    setTripStatus("searching");

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
      status: "Encours",
      createdAt: serverTimestamp(),
      userId: user.uid,
      otpEntered: false,
    };

    try {
      const tripRef = await addDoc(collection(db, "trajet"), tripData);
      setTripId(tripRef.id);
      console.log("Données du trajet envoyées avec succès à Firestore !");

      await set(ref(database, `trajets/${tripRef.id}`), {
        ...tripData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      Alert.alert("Erreur", "Impossible de créer le trajet. Veuillez réessayer.");
    }
  };

  const handleCancelTrip = async () => {
    if (!tripId) return;

    if (cancellationReasons.length === 0 && customReason.trim() === "") {
      Alert.alert("Erreur", "Veuillez sélectionner un motif d'annulation.");
      return;
    }

    const cancellationReason = [
      ...cancellationReasons,
      customReason.trim() !== "" ? customReason : null,
    ].filter(Boolean).join(", ");

    try {
      await updateDoc(doc(db, "trajet", tripId), {
        status: "annulé",
        cancellationReason,
      });
      Alert.alert("Succès", "Le trajet a été annulé.");
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'annulation du trajet :", error);
      Alert.alert("Erreur", "Impossible d'annuler le trajet. Veuillez réessayer.");
    }
  };

  const closeModal = () => {
    setTripStatus("idle");
    setOtp(null);
    setTripId(null);
    setOtpEntered(false);
    setShowCancelModal(false);
    setCancellationReasons([]);
    setCustomReason("");
    onClose();
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
            {tripStatus === "idle" ? (
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
                  <Text style={styles.value}>{destination.address}</Text>
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
            ) : tripStatus === "searching" ? (
              <>
                <Text style={styles.modalTitle}>Recherche de chauffeur en cours</Text>
                <ActivityIndicator size="large" color="#28a745" />
                <Text style={styles.loadingText}>Veuillez patienter...</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Trajet confirmé</Text>
                <Text style={styles.otpText}>
                  Code OTP pour le chauffeur :{" "}
                  <Text style={styles.otp}>{otp}</Text>
                </Text>
                <Text style={styles.driverMessage}>Votre chauffeur sera là dans un instant</Text>
                <TouchableOpacity
                  style={[styles.cancelButton, otpEntered && styles.disabledButton]}
                  onPress={() => setShowCancelModal(true)}
                  disabled={otpEntered}
                >
                  <Text style={styles.cancelButtonText}>Annuler le trajet</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de motif d'annulation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Motif d'annulation</Text>
            <ScrollView>
              {predefinedReasons.map((reason, index) => (
                <CustomCheckbox
                  key={index}
                  label={reason}
                  value={cancellationReasons.includes(reason)}
                  onValueChange={(selected: any) => {
                    if (selected) {
                      setCancellationReasons([...cancellationReasons, reason]);
                    } else {
                      setCancellationReasons(cancellationReasons.filter((r) => r !== reason));
                    }
                  }}
                />
              ))}
              <TextInput
                style={styles.customReasonInput}
                placeholder="Autre motif (optionnel)"
                value={customReason}
                onChangeText={setCustomReason}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCancelTrip}
            >
              <Text style={styles.confirmButtonText}>Confirmer l'annulation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCancelModal(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  driverMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    width: "100%",
  },
});

export default PayModal;