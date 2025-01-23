import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import PriceModal from "./PriceModal";
import { useLocationStore } from "@/Redux/store/useStore";

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  userLocation: { latitude: number; longitude: number; address: string } | null;
  onDestinationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  distance: number | null;
  duration: number | null;
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  onDestinationSelect,
  userLocation,
  distance,
  duration,
}) => {
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const { userAddress, setUserLocation } = useLocationStore();

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  const openPriceModal = () => {
    onClose();
    setTimeout(() => {
      setPriceModalVisible(true);
    }, 300);
  };

  const closePriceModal = () => {
    setPriceModalVisible(false);
  };

  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                  <Image source={icons.close} style={styles.closeImage} />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Choisissez votre adresse</Text>

                <View style={styles.inputContainer}>
                  <Image source={icons.point} style={styles.inputIcon} />
                  <Text style={styles.inputText}>
                    {userAddress || "Chargement de votre position..."}
                  </Text>
                </View>

                {/* Destination Input */}
                <GoogleTextInput
                  icon={icons.search}
                  handlePress={(location) => {
                    setSelectedDestination(location.address);
                    onDestinationSelect(location);
                  }}
                  containerStyle="width: 100%;"
                  textInputBackgroundColor="#f5f5f5"
                />
                <Text style={styles.noAddressText}>
                  {selectedDestination
                    ? selectedDestination
                    : "Aucune adresse choisie"}
                </Text>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={openPriceModal}
                >
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Price Modal */}
      <PriceModal
        visible={priceModalVisible}
        onClose={closePriceModal}
        destination={selectedDestination || ""}
        userLocation={userLocation}
        distance={distance}
        duration={duration}
      />
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  scrollViewContent: {
    flexGrow: 1,
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
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#666",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
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
