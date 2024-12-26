import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { DrawerActions } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
import { useDriverStore, useLocationStore } from "@/store/useStore";
import { icons } from "@/constants";
import Map from "@/components/Map";
import GoogleTextInput from "@/components/GoogleTextInput";
import { useNavigation, useRouter } from "expo-router";

const { height: screenHeight } = Dimensions.get("window");

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const navigation = useNavigation();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

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

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign out",
        onPress: () => {
          //   router.push("/(root)/sign-in");
        },
      },
    ]);
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

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
          <View style={styles.header}>
            {/* A changer pour l'utilisateur courant */}
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Image
                source={require("../../../assets/image/user.jpg")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  resizeMode: "cover",
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bienvenue GuestUser👋</Text>
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                padding: 10,
                borderRadius: 9999,
                backgroundColor: "#fff",
                elevation: 5,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={icons.out} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
          <GoogleTextInput
            icon={icons.search}
            handlePress={handleDestinationPress}
          />
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
              zIndex: 1000,
              flex: 1,
              height: screenHeight * 0.6,
            }}
          >
            <Map />
          </View>
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default Home;
