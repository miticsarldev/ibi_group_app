import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { DrawerActions } from "@react-navigation/native";
import * as Location from "expo-location";
import { useLocationStore } from "@/store/useStore";
import { icons } from "@/constants";
import Map from "@/components/Map";
import CustomModal from "@/components/Modal";
import { useNavigation, useRouter } from "expo-router";

const { height: screenHeight } = Dimensions.get("window");

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const navigation = useNavigation();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

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

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    setModalVisible(false);
    setTimeout(() => {
      router.replace("/(Utilisateurs)/Adresse");
    }, 3000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: "#f5f5f5" }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Image
                source={require("../../../assets/image/user.jpg")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bienvenue Aly Sow👋</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
                  { text: "Annuler", style: "cancel" },
                  { text: "Se déconnecter", onPress: () => console.log("Déconnecté") },
                ])
              }
              style={styles.logoutButton}
            >
              <Image source={icons.out} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <Map />
          </View>

          {/* Bouton pour choisir la destination */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.chooseDestinationButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Choisir une destination</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Modal */}
          <CustomModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onDestinationSelect={handleDestinationPress}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    resizeMode: "cover",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 9999,
    backgroundColor: "#fff",
    elevation: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    height: screenHeight * 0.6,
    zIndex: 1000,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 2000,
  },
  chooseDestinationButton: {
    backgroundColor: "#0FAC71",
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
