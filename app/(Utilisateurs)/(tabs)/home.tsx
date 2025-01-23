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
import { icons } from "@/constants";
import Map from "@/components/Map";
import CustomModal from "@/components/Modal";
import { useNavigation, useRouter } from "expo-router";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocationStore } from "@/Redux/store/useStore";

const { height: screenHeight } = Dimensions.get("window");

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const navigation = useNavigation();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userLocation, setUserLocationState] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "personne", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName);
        }
      }
    };

    fetchUserData();

    // Récupérer la localisation de l'utilisateur
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

      const userLocationData = {
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      };

      setUserLocation(userLocationData); // Stockage global
      setUserLocationState(userLocationData); // Stockage local pour passer à CustomModal
    })();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    setModalVisible(false);
    setTimeout(() => {}, 3000);
  };
  // Fonction pour mettre à jour la distance et la durée
  const updateRouteInfo = (distance: number, duration: number) => {
    setDistance(distance);
    setDuration(duration);
    console.log("Distance du trajet:", distance);
    console.log("Durée du trajet:", duration);
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Image
                source={require("../../../assets/image/user.jpg")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bienvenue {userName} 👋</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Déconnexion",
                  "Voulez-vous vraiment vous déconnecter ?",
                  [
                    { text: "Annuler", style: "cancel" },
                    {
                      text: "Se déconnecter",
                      onPress: () => console.log("Déconnecté"),
                    },
                  ]
                )
              }
              style={styles.logoutButton}
            >
              <Image source={icons.out} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <Map updateRouteInfo={updateRouteInfo} />
          </View>

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
            userLocation={userLocation}
            distance={distance}
            duration={duration}
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
