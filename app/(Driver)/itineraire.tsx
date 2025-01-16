import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView, PanGestureHandler, State, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/styles";
import { useLocationStore } from "@/store/useStore";
import Map2 from "@/components/MapItineraire";  
import { useSearchParams } from "expo-router/build/hooks";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { trajet } from "@/interface/trajet";
import { personne } from "@/interface/personne";


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
  const [userLocation, setUserLocationState] = useState<LocationType | null>(null);
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [tripStage, setTripStage] = useState<"pickup" | "dropoff">("pickup");
  const [trajetData, setTrajetData] = useState<trajet | null>(null);
  const [personneData, setPersonneData] = useState<personne | null>(null);
  const infoParams = useSearchParams();
  const [destination, setDestination] = useState<LocationType | null>(null); 
  const translateY = useSharedValue(0);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const trajetId = infoParams.get("trajetId");

    // Récupération des données du trajet depuis Firestore
    useEffect(() => {
      const fetchTrajet = async () => {
        if (!trajetId) return;
  
        try {
          const db = getFirestore();
          const trajetRef = doc(db, "trajet", trajetId);
          const trajetSnap = await getDoc(trajetRef);
  
          if (trajetSnap.exists()) {
            const data = trajetSnap.data() as trajet; // Cast des données en type Trajet
            setTrajetData(data);
          // Récupérer les informations de la personne
          if (data.personneId) {
            const personneRef = doc(db, "personne", data.personneId); // Nom de votre collection "personnes"
            const personneSnap = await getDoc(personneRef);

            if (personneSnap.exists()) {
              setPersonneData(personneSnap.data() as personne);
            }
            } else {
              console.error("Personne introuvable !");
            }
          } else {
            console.error("Trajet introuvable !");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du trajet :", error);
        }
      };
  
      fetchTrajet();
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
          latitude: trajetData?.destinationLat ?? currentLocation.latitude,
          longitude: trajetData?.destinationLon ?? currentLocation.longitude,
          address: trajetData?.destinationAddress ?? "Destination par défaut",
        });
      }
    })();

      // const userLoc: LocationType = {
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   address: `${address[0]?.name ?? ""}, ${address[0]?.region ?? ""}`,
      // };

      // setUserLocation(userLoc);
      // setUserLocationState(userLoc);

      // const defaultDestination: LocationType = {
      //   latitude: 12.6392,
      //   longitude: -8.0029,
      //   address: "Destination Client",
      // };

      // setDestination(defaultDestination);
      // setDestinationLocation(defaultDestination);
    // })();
  }, [trajetData, tripStage]); 

  const handleNextStage = () => {
    if (tripStage === "pickup") {
      router.push({
        pathname: "/(Driver)/otp",
        params: { trajetId },
      }); 
    } else if (tripStage === "dropoff") {
      alert("Trajet terminé !");
      router.push("/(Driver)/trajet");
    }
  };

  const searchParams = useSearchParams();
 

  useEffect(() => {
    const stage = searchParams.get("tripStage") as "pickup" | "dropoff" | null;
    if (stage === "pickup" || stage === "dropoff") {
      setTripStage(stage); // Mise à jour de l'état
    }
  }, [searchParams]);
  




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
        onGestureEvent={gestureHandler}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            gestureEndHandler(event);
          }
        }}
      >
        <Animated.View style={[styles.detailsContainer, animatedStyle]}>
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
                  {trajetData.destination}
                </Text>
              </View>
            </View>
            <Text style={styles.price}>
              Montant à payer : {trajetData.prix} XOF
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleNextStage}>
              <Text style={styles.actionButtonText}>
                {tripStage === "pickup" ? "Passager récupéré" : "Trajet terminé"}
              </Text>
            </TouchableOpacity>
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











// import React, { useEffect, useState } from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, } from "react-native";
// import * as Location from "expo-location";
// import { GestureHandlerRootView, PanGestureHandler, State, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { COLORS } from "@/constants/styles";
// import { useLocationStore } from "@/store/useStore";
// import Map2 from "@/components/MapItineraire";  
// import { useSearchParams } from "expo-router/build/hooks";


  // Récupération des paramètres via .get()
  // const trajetId = infoParams.get("trajetId");
  // const clientLat = infoParams.get("clientLat");
  // const clientLon = infoParams.get("clientLon");
  // const destinationLat = infoParams.get("destinationLat");
  // const destinationLon = infoParams.get("destinationLon");
  // const chauffeurLat = infoParams.get("chauffeurLat");
  // const chauffeurLon = infoParams.get("chauffeurLon");
  
  // console.log("Trajet ID:", trajetId);
  // console.log("Client Latitude:", clientLat);
  // console.log("Client Longitude:", clientLon);
  // console.log("Destination Latitude:", destinationLat);
  // console.log("Destination Longitude:", destinationLon);

// const { height } = Dimensions.get("window");
// const MIN_HEIGHT = height - 520;
// const MAX_HEIGHT = 0;

// type LocationType = {
//   latitude: number;
//   longitude: number;
//   address: string;
// };

// const Itineraire = () => {
//   const { setUserLocation, setDestinationLocation } = useLocationStore();
//   const router = useRouter();
//   const [userLocation, setUserLocationState] = useState<LocationType | null>(null);
//   const [destination, setDestination] = useState<LocationType | null>(null); 
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;

//       const location = await Location.getCurrentPositionAsync({});
//       const address = await Location.reverseGeocodeAsync({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       const userLoc: LocationType = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         address: `${address[0]?.name ?? ""}, ${address[0]?.region ?? ""}`,
//       };

//       setUserLocation(userLoc);
//       setUserLocationState(userLoc);

//       const defaultDestination: LocationType = {
//         latitude: 12.6392,
//         longitude: -8.0029,
//         address: "Destination Client",
//       };

//       setDestination(defaultDestination);
//       setDestinationLocation(defaultDestination);
//     })();
//   }, []);  

//   const searchParams = useSearchParams();
//   const [tripStage, setTripStage] = useState<"pickup" | "dropoff">("pickup");

//   useEffect(() => {
//     const stage = searchParams.get("tripStage") as "pickup" | "dropoff" | null;
//     if (stage === "pickup" || stage === "dropoff") {
//       setTripStage(stage); // Mise à jour de l'état
//     }
//   }, [searchParams]);
  
//   const handleNextStage = () => {
//     if (tripStage === "pickup") {
//       router.push("/(Driver)/otp");
//     } else if (tripStage === "dropoff") {
//       alert("Trajet terminé !");
//       router.push("/(Driver)/trajet");
//     }
//   };

//   const translateY = useSharedValue(0);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
//     const { translationY } = event.nativeEvent;
//     translateY.value = Math.min(MIN_HEIGHT, Math.max(MAX_HEIGHT, translationY));
//   };

//   const gestureEndHandler = (event: PanGestureHandlerGestureEvent) => {
//     const { translationY } = event.nativeEvent;
//     if (translationY > height / 4) {
//       translateY.value = withSpring(MIN_HEIGHT);
//       setIsCollapsed(true);
//     } else {
//       translateY.value = withSpring(MAX_HEIGHT);
//       setIsCollapsed(false);
//     }
//   };

//   const handleExpand = () => {
//     translateY.value = withSpring(MAX_HEIGHT);
//     setIsCollapsed(false);
//   };

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//     const trajet = {
//     id: 1,
//     type: "Passager",
//     localisation: "Sotuba à Yirimadio",
//     personnes: 1,
//     temps: "5 mins",
//     distance: "800m",
//     prix: "2000 CFA",
//     image: require("../../assets/image/person.jpg"),
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       {/* Carte avec Directions */}
//       <View style={styles.mapContainer}>
//         <Map2 userLocation={userLocation} destination={destination} />
//       </View>

//       {/* Icône pour réafficher le panneau */}
//       {isCollapsed && (
//         <TouchableOpacity style={styles.expandButton} onPress={handleExpand}>
//           <Ionicons name="chevron-up" size={30} color="#000" />
//         </TouchableOpacity>
//       )}

//       {/* Détails glissables */}
//       <PanGestureHandler
//         onGestureEvent={gestureHandler}
//         onHandlerStateChange={(event) => {
//           if (event.nativeEvent.state === State.END) {
//             gestureEndHandler(event);
//           }
//         }}
//       >
//         <Animated.View style={[styles.detailsContainer, animatedStyle]}>
//           <View style={styles.handleBar} />
//           <Text style={styles.arrivalTime}>Heure estimée : 15h35</Text>
//           <View style={styles.userInfo}>
//             <Image source={trajet.image} style={styles.userImage} />
//             <View>
//               <Text style={styles.userName}>Aly Touré</Text>
//               <Text style={styles.userDetails}>
//                 {trajet.distance} ({trajet.temps}){"\n"}
//                 {trajet.localisation}
//               </Text>
//             </View>
//           </View>
//           <Text style={styles.price}>
//             {tripStage === "pickup" ? "À récupérer" : "À déposer"} : {trajet.prix}
//           </Text>
//           <TouchableOpacity style={styles.actionButton} onPress={handleNextStage}>
//             <Text style={styles.actionButtonText}>
//               {tripStage === "pickup" ? "Passager récupéré" : "Trajet terminé"}
//             </Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </PanGestureHandler>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mapContainer: {
//     flex: 1,
//   },
//   detailsContainer: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height / 3,
//     elevation: 5,
//   },
//   handleBar: {
//     width: 40,
//     height: 5,
//     backgroundColor: "#ccc",
//     borderRadius: 2.5,
//     alignSelf: "center",
//     marginBottom: 10,
//   },
//   arrivalTime: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   userImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   userDetails: {
//     fontSize: 14,
//     color: "#666",
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   actionButton: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   actionButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   expandButton: {
//     position: "absolute",
//     bottom: 80,
//     right: 20,
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 25,
//     elevation: 5,
//   },
// });

// export default Itineraire;
