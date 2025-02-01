import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView, PanGestureHandler, State, PanGestureHandlerGestureEvent, TextInput } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/styles";
import Map2 from "@/components/MapItineraire";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { trajet } from "@/interface/trajet";
import { personne } from "@/interface/personne";
import { fetchTrajet, terminerTrajet } from "@/services/trajetService";
import { setLoading } from "@/redux/slices/trajetSlice";


const { height } = Dimensions.get("window");
const MIN_HEIGHT = height - 520;
const MAX_HEIGHT = 0;

type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};

const Itineraire = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const searchParams = useSearchParams();
  const trajetId = params.trajetId as string; 

  const [tripStage, setTripStage] = useState<"pickup" | "dropoff">("pickup");
  const [trajetData, setTrajetData] = useState<trajet | null>(null);
  const [personneData, setPersonneData] = useState<personne | null>(null);
  const [userLocation, setUserLocationState] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [cancelReason, setCancelReason] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const translateY = useSharedValue(0);

  useEffect(() => {
    const loadTrajet = async () => {
      if (!trajetId) return;
      const { trajet, personne } = await fetchTrajet(trajetId);
      setTrajetData(trajet);
      setPersonneData(personne);
    };

    loadTrajet();
  }, [trajetId]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const currentLocation: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0]?.name ?? ""}, ${address[0]?.region ?? ""}`,
      };

      setUserLocationState(currentLocation);

      if (tripStage === "pickup") {
        setDestination({
          latitude: trajetData?.userLocation.latitude ?? currentLocation.latitude,
          longitude: trajetData?.userLocation.longitude ?? currentLocation.longitude,
          address: trajetData?.userLocation.address ?? "Destination par défaut",
        });
      }else{
        setDestination({
          latitude: trajetData?.destination?.latitude ?? currentLocation.latitude,
          longitude: trajetData?.destination?.longitude ?? currentLocation.longitude,
          address: trajetData?.destination?.address ?? "Destination par défaut"
        });
      }
    })();
  }, [trajetData, tripStage]); 

  useEffect(() => {
    const stage = searchParams.get("tripStage") as "pickup" | "dropoff" | null;
    if (stage === "pickup" || stage === "dropoff") {
      setTripStage(stage);
    }
  }, [searchParams]);


  const handleNextStage = async () => {
    if (!trajetData) return;

    if (tripStage === "pickup") {
      router.push(`/(Driver)/otp?trajetId=${trajetId}`) 
    } else if (tripStage === "dropoff") { 
      await terminerTrajet(trajetId);
      alert("Trajet terminé !");
      router.push("/(Driver)/trajet");
    }
  };

  const confirmCancel = () => {
    // handleCancel(cancelReason);
    router.push(`/(Driver)/trajet`)
    setModalVisible(false);

  };

  
  const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    translateY.value = Math.min(MIN_HEIGHT, Math.max(MAX_HEIGHT, translationY));
  };

  const gestureEndHandler = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    if (translationY > height / 4) {
      translateY.value = withSpring(MIN_HEIGHT);
      setIsCollapsed(true);
    } else {
      translateY.value = withSpring(MAX_HEIGHT);
      setIsCollapsed(false);
    }
  };

  const handleExpand = () => {
    translateY.value = withSpring(MAX_HEIGHT);
    setIsCollapsed(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Carte avec Directions */}
      <View style={styles.mapContainer}>
        <Map2 userLocation={userLocation} destination={destination} />
      </View>

      {/* Icône pour réafficher le panneau */}
      {isCollapsed && (
        <TouchableOpacity style={styles.expandButton} onPress={handleExpand}>
          <Ionicons name="chevron-up" size={30} color="#000" />
        </TouchableOpacity>
      )}

      {/* Détails glissables */}
      <PanGestureHandler
        onGestureEvent={(event) => {
          translateY.value = Math.min(MIN_HEIGHT, Math.max(MAX_HEIGHT, event.nativeEvent.translationY));
        }}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            translateY.value = withSpring(event.nativeEvent.translationY > height / 4 ? MIN_HEIGHT : MAX_HEIGHT);
            setIsCollapsed(event.nativeEvent.translationY > height / 4);
          }
        }}
        // onGestureEvent={gestureHandler}
        // onHandlerStateChange={(event) => {
        //   if (event.nativeEvent.state === State.END) {
        //     gestureEndHandler(event);
        //   }
        // }}
      >
        <Animated.View style={[styles.detailsContainer, animatedStyle]}>
        {/* {trajetData && personneData ? (
          <View>
            <View style={styles.handleBar} />
            <Text style={styles.arrivalTime}>Heure estimée : 15h35</Text>
            <View style={styles.userInfo}>
              <Image source={require("../../assets/image/person.jpg")} style={styles.userImage} />
              <View>
                <Text style={styles.userName}>{personneData.fullName}</Text>
                <Text style={styles.userDetails}>
                  800m (30mns){"\n"}
                  {trajetData.destination?.address}
                </Text>
              </View>
            </View>
            <Text style={styles.price}>
              Montant à payer : {trajetData.price} 
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleNextStage}>
              <Text style={styles.actionButtonText}>
                {tripStage === "pickup" ? "Passager récupéré" : "Trajet terminé"}
              </Text>
            </TouchableOpacity>
          </View>  
        ) : (
            <Text>Chargement des données...</Text>
          )} */}
          {trajetData && personneData ? (
      <View>
        <View style={styles.handleBar} />
        <Text style={styles.arrivalTime}>Heure estimée : 15h35</Text>
        <View style={styles.userInfo}>
          <Image source={require("../../assets/image/person.jpg")} style={styles.userImage} />
          <View>
            <Text style={styles.userName}>{personneData.fullName}</Text>
            <Text style={styles.userDetails}>
              800m (30mns){"\n"}
              {trajetData.destination?.address}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>Montant à payer : {trajetData.price}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleNextStage}>
            <Text style={styles.actionButtonText}>
              {tripStage === "pickup" ? "Passager récupéré" : "Trajet terminé"}
            </Text>
          </TouchableOpacity>
          {tripStage !== "dropoff" && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Modal pour saisir le motif d'annulation */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Motif d'annulation</Text>
              <TextInput
                style={styles.input}
                placeholder="Saisissez votre motif"
                value={cancelReason}
                onChangeText={setCancelReason}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmCancel}>
                  <Text style={styles.modalButtonText}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    ) : (
      <Text>Chargement des données...</Text>
    )}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, 
  mapContainer: {
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 3,
    elevation: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetails: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expandButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
});

export default Itineraire;  
  
 