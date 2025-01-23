 import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import ToastMessage from '@/components/ToastMessage';
import { initializeTrajets, fetchTrajetsInRadius, updateTrajetStatus } from "@/services/trajetService";
import { COLORS, FONTS, SIZES } from '@/constants/styles';
import { trajet } from '@/interface/trajet';
import { createHistoriqueTrajet } from "@/services/historiqueTrajetService";
import { historiqueTrajet } from "@/interface/historiqueTrajet";
import * as Location from "expo-location";
import { useLocationStore } from "@/store/useStore"; 
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

interface Toast {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

const TrajetDisponible: React.FC<{ chauffeurLat: number; chauffeurLon: number }> = ({ chauffeurLat, chauffeurLon }) => {
  const [trajets, setTrajets] = useState<trajet[]>([]);
  const { setUserLocation } = useLocationStore(); 
  const [toast, setToast] = useState<Toast>({ message: "", type: "success", visible: false });
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  const initializeAndLoadData = async () => {
    setLoading(true);
    try {
      // Demande de permissions pour la localisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setToast({ message: "Permission refusée pour la localisation", type: "error", visible: true });
        return;
      }

      // Récupération de la localisation actuelle
      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log("Localisation utilisateur :", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      // Mise à jour de la localisation utilisateur
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      // Initialisation des trajets (si nécessaire)
      await initializeTrajets();

      // Chargement des trajets dans le rayon
      const data = await fetchTrajetsInRadius(location.coords.latitude, location.coords.longitude);
      console.log("Réponse de fetchTrajetsInRadius :", data);
      setTrajets(data); 
    } catch (error) {
      setToast({ message: "Erreur lors du chargement des trajets ou de la localisation", type: "error", visible: true });
    }
  };

  useEffect(() => {
    initializeAndLoadData();
  }, []);

  const handleAccept = async (trajet: trajet) => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non connecté.');
      }
    try {
      await updateTrajetStatus(trajet.id, "accepter");
      setToast({ message: "Trajet accepté", type: "success", visible: true });
      
      // Récupérer la position actuelle du chauffeur
      const location = await Location.getCurrentPositionAsync({});
      const geocodedAddresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Vérifie s'il y a au moins une adresse trouvée
      const depart = geocodedAddresses.length > 0
      ? (geocodedAddresses[0].street ?? geocodedAddresses[0].subregion ?? geocodedAddresses[0].city ?? "Adresse inconnue")
      : "Adresse inconnue";


      // Construire l'objet HistoriqueTrajet
      const historique: historiqueTrajet = {
        trajetId: trajet.id,
        chauffeurId: user.uid,
        statut: "Encours",
        depart, 
        destination: trajet.destination,
        createdAt: new Date().toISOString(),
        montant: trajet.prix,
      };
      // Appeler le service pour enregistrer l'historique
      await createHistoriqueTrajet(historique);
      
      // Supprimer le trajet accepté de la liste locale
      setTrajets((prev) => prev.filter((t) => t.id !== trajet.id));

      // Rediriger vers l'itinéraire
      router.push({
        pathname: "/(Driver)/itineraire",
        params: { trajetId : trajet.id},
      });
    } catch {
      setToast({ message: "Erreur lors de l'acceptation", type: "error", visible: true });
    }
  };

  const handleReject = async (trajetId: string) => {
    try {
      // Retire le trajet de la liste locale uniquement
      setTrajets((prev) => prev.filter((t) => t.id !== trajetId));
  
      // Affiche un message de confirmation
      setToast({ message: "Trajet refusé", type: "success", visible: true });
    } catch (error) {
      console.error("Erreur lors du refus du trajet :", error);
      setToast({ message: "Erreur lors du refus", type: "error", visible: true });
    }
  };

  // Fonction utilitaire pour calculer le temps écoulé en minutes
  const getTimeElapsedInMinutes = (dateISOString: string | null | undefined): string => {
    if (!dateISOString) return "Temps non spécifié";
  
    const currentDate = new Date();
    const givenDate = new Date(dateISOString);
  
    // Vérifie si la conversion en date est valide
    if (isNaN(givenDate.getTime())) {
      return "Date invalide";
    }
  
    const elapsedTime = Math.floor((currentDate.getTime() - givenDate.getTime()) / 60000); // Différence en minutes
  
    if (elapsedTime < 1) {
      return "Moins d'une minute";
    } else if (elapsedTime === 1) {
      return "1 minute";
    } else {
      return `${elapsedTime} minutes`;
    }
  };
  

  const renderTrajet = ({ item }: { item: trajet }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.carType}>{item.type ?? "Type non spécifié"}</Text>
        <Text style={styles.infoText}>{item.nmbrePers ? `${item.nmbrePers} prs` : "Nombre de personnes inconnu"} | Il y'a {getTimeElapsedInMinutes(item.dateCreate)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.carDetails}>
          <Text style={styles.infoText}>{item.destination ?? "Localisation inconnue"}</Text>
          <Text style={styles.infoText}>{item.distance ? `${item.distance} km` : "Distance non spécifiée"}</Text>
          <Text style={styles.infoText}>{item.prix ? `${item.prix} CFA` : "Prix non spécifié"}</Text>
        </View>
        {item.type == "moto" ? (
          <Image source={require("../../assets/image/motoba.png")} style={styles.carImage} />
        ) : (
          <Image source={require("../../assets/image/personnel.png")} style={styles.carImage} />
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.refuserButton} onPress={() => handleReject(item.id)}>
          <Text style={styles.buttonText}>Refuser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accepterButton} onPress={() => handleAccept(item)}>
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trajets}
        renderItem={renderTrajet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun trajet disponible.</Text>
          </View>
        }
      />
      <ToastMessage
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    padding: SIZES.padding,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: COLORS.gray,
  },
  list: {
    paddingBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.paddingSmall,
    marginBottom: SIZES.base,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: SIZES.radius,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  carType: {
    fontSize: SIZES.fontLarge,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  infoText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.base,
  },
  carDetails: {
    flex: 1,
  },
  carImage: {
    width: SIZES.iconSize * 5,
    height: SIZES.iconSize * 4,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.inputBackground,
  },
  placeholderImage: {
      width: 80,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.gray,
      borderRadius: SIZES.radius,
  },
  placeholderText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.base,
  },
  refuserButton: {
    backgroundColor: COLORS.darkGray,
    borderRadius: SIZES.radius,
    height: SIZES.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginRight: SIZES.base,
  },
  accepterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: SIZES.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
});

export default TrajetDisponible;









// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS, FONTS, SIZES } from "../../constants/styles"; 
// import { DrawerNavigationProp } from '@react-navigation/drawer';
// import { router } from 'expo-router';

// // Typage des trajets
// interface Trajet {
//   id: number;
//   type: string;
//   localisation: string;
//   personnes: number;
//   temps: string;
//   distance: string;
//   prix: string;
//   image: any;
// }

// // Typage de navigation
// type RootStackParamList = {
//   TrajetDisponible: undefined;
// };

// type NavigationProp = DrawerNavigationProp<RootStackParamList, 'TrajetDisponible'>;

// interface TrajetDisponibleProps {
//   navigation: NavigationProp;
// }

// const TrajetDisponible: React.FC<TrajetDisponibleProps> = ({ navigation }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//     console.log("Sidebar toggled:", isSidebarOpen);
//   };

//   const handleNext = () => {
//     router.navigate('/(Driver)/itineraire'); 
//   }
//   const trajets: Trajet[] = [
//     {
//       id: 1,
//       type: 'Super Car',
//       localisation: 'Lafiabougou',
//       personnes: 2,
//       temps: 'il y a 3 mins',
//       distance: '800m (à 5 mins)',
//       prix: '500 CFA',
//       image: require('../../assets/image/voiture.png'),
//     },
//     {
//       id: 2,
//       type: 'Car Eco',
//       localisation: 'Kati',
//       personnes: 1,
//       temps: 'il y a 23 mins',
//       distance: '900m (à 5 mins)',
//       prix: '1000 CFA',
//       image: require('../../assets/image/personnel.png'),
//     },
//   ];

//   const renderTrajet = ({ item }: { item: Trajet }) => (

//     <View style={styles.card}>
//       {/* Titre et info principale */}
//       <View style={styles.cardHeader}>
//         <Text style={styles.carType}>{item.type}</Text>
//         <Text style={styles.infoText}>{item.personnes} prs | {item.temps}</Text>
//       </View>

//       {/* Contenu principal avec détails et image */}
//       <View style={styles.cardContent}>
//         <View style={styles.carDetails}>
//           <View style={styles.row}>
//             <Ionicons name="location-outline" size={16} color="#00A76E" />
//             <Text style={styles.infoText}>{item.localisation}</Text>
//           </View>
//           <View style={styles.row}>
//             <Ionicons name="walk-outline" size={16} color="#00A76E" />
//             <Text style={styles.infoText}>{item.distance}</Text>
//           </View>
//           <View style={styles.row}>
//             <Ionicons name="cash-outline" size={16} color="#00A76E" />
//             <Text style={styles.infoText}>{item.prix}</Text>
//           </View>
//         </View>
//         <Image source={item.image} style={styles.carImage} />
//       </View>

//       {/* Boutons d'action */}
//       <View style={styles.cardActions}>
//         <TouchableOpacity style={styles.refuserButton}>
//           <Text style={styles.buttonText}>Refuser</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleNext} style={styles.accepterButton}>
//           <Text style={styles.buttonText}>Accepter</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}> 

//       <FlatList
//         data={trajets}
//         renderItem={renderTrajet}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.gray,
//   },
//   list: {
//     padding: SIZES.padding,
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     marginBottom: SIZES.padding,
//     shadowColor: COLORS.black,
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: SIZES.base,
//   },
//   carType: {
//     fontSize: SIZES.font,
//     fontWeight: 'bold',
//     color: COLORS.text,
//   },
//   infoText: {
//     fontSize: SIZES.font - 2,
//     color: COLORS.darkGray,
//     marginLeft: 4,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: SIZES.base,
//   },
//   carDetails: {
//     flex: 1,
//   },
//   carImage: {
//     width: 100,
//     height: 60,
//     borderRadius: SIZES.radius,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   refuserButton: {
//     flex: 1,
//     backgroundColor: COLORS.darkGray,
//     paddingVertical: SIZES.base,
//     borderRadius: SIZES.radius,
//     marginRight: SIZES.base,
//     alignItems: 'center',
//   },
//   accepterButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     paddingVertical: SIZES.base,
//     borderRadius: SIZES.radius,
//     marginLeft: SIZES.base,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: SIZES.font - 2,
//     fontWeight: 'bold',
//   },
// });

// export default TrajetDisponible;


