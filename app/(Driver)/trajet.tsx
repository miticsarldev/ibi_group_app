 import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import ToastMessage from '@/components/ToastMessage';
import { fetchTrajetsInRadius, updateTrajetStatus } from "@/services/trajetService";
import { COLORS, FONTS, SIZES } from '@/constants/styles';
import { trajet } from '@/interface/trajet'; 
import * as Location from "expo-location";
import { useLocationStore } from "@/store/useStore"; 
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Blur from '@/components/loader';
import { Timestamp } from "firebase/firestore"; 

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
  const [trajetAccepte, setTrajetAccepte] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Utilisateur non connecté.');
  }

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

      // Chargement des trajets dans le rayon
      const data = await fetchTrajetsInRadius(location.coords.latitude, location.coords.longitude);
      console.log("Réponse de fetchTrajetsInRadius :", data);
      // setTrajets(data); 
      setTrajets(Array.isArray(data) ? data : []);
    } catch (error) {
      setToast({ message: "Erreur lors du chargement des trajets ou de la localisation", type: "error", visible: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAndLoadData();
  }, []);

  const handleAccept = async (trajet: trajet) => {
    setLoading(true);
    try {
      const chauffeurId = user.uid;

      await updateTrajetStatus(trajet.id, "accepter", chauffeurId);
      setToast({ message: "Trajet accepté", type: "success", visible: true });

      // Supprimer le trajet accepté de la liste locale
      setTrajets((prev) => prev.filter((t) => t.id !== trajet.id || t.chauffeurId === chauffeurId));
      
      router.push(`/(Driver)/itineraire?trajetId=${trajet.id}`)
    } catch {
      setToast({ message: "Erreur lors de l'acceptation", type: "error", visible: true });
    } finally {
      setLoading(false);
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
  const getTimeElapsedInMinutes = (dateValue: Timestamp | string | null | undefined): string => {
    if (!dateValue) return "Temps non spécifié";
  
    const currentDate = new Date();
    let givenDate: Date;
  
    // Vérification du type de dateValue (Timestamp ou string)
    if (dateValue instanceof Timestamp) {
      givenDate = dateValue.toDate();
    } else {
      givenDate = new Date(dateValue);
    }
  
    // Si la date est invalide, retour d'une valeur d'erreur
    if (isNaN(givenDate.getTime())) {
      return "Date invalide";
    }
  
    const elapsedTimeInMinutes = Math.floor((currentDate.getTime() - givenDate.getTime()) / 60000); // Temps écoulé en minutes
  
    // Si l'écart est inférieur à 1 minute
    if (elapsedTimeInMinutes < 1) {
      return "Moins d'une minute";
    }
  
    // Si l'écart est inférieur à 60 minutes, retourne les minutes
    if (elapsedTimeInMinutes < 60) {
      return `${elapsedTimeInMinutes} min${elapsedTimeInMinutes > 1 ? 's' : ''}`;
    }
  
    // Si l'écart est supérieur à 60 minutes, afficher l'heure et la date
    const hours = Math.floor(elapsedTimeInMinutes / 60);
    const minutes = elapsedTimeInMinutes % 60;
  
    // Formater la date au format "jj/mm/aaaa"
    const formattedDate = givenDate.toLocaleDateString('fr-FR');
  
    // Vérifier si l'heure est proche de 23h59
    const currentTime = new Date();
    if (currentTime.getHours() === 23 && currentTime.getMinutes() === 59) {
      return formattedDate; // Renvoie uniquement la date sans l'heure
    }
  
    const formattedTime = givenDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
    return `${hours} h${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''} `;
  };


  const renderTrajet = ({ item }: { item: trajet }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.carType}>{item.type ?? "Type non spécifié"}</Text>
        <Text style={styles.infoText}>Il y'a {getTimeElapsedInMinutes(item.createdAt)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.carDetails}>
          <Text style={styles.infoText}> {item.userLocation?.address ? `${item.userLocation?.address}` : "Adresse inconue"}</Text>
          <Text style={styles.infoText}> 8km </Text>
          <Text style={styles.infoText}>{item.price ? `${item.price}` : "Prix non spécifié"}</Text>
        </View>
        {item.type == "moto" ? (
          <Image source={require("../../assets/image/motoba.png")} style={styles.carImage} />
        ) : (
          <Image source={require("../../assets/image/personnel.png")} style={styles.carImage} />
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.refuserButton} onPress={() => handleReject(item.id)} >
          <Text style={styles.buttonText}>Refuser</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.accepterButton} onPress={() => handleAccept(item)} disabled={loading}> */}
        {item.id === trajetAccepte ? (
        <TouchableOpacity style={styles.encoursButton} disabled>
          <Text style={styles.buttonText}>EnCours</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.accepterButton} 
          onPress={() => {
            handleAccept(item);
            setTrajetAccepte(item.id);
          }} 
          disabled={!!trajetAccepte || loading}
        >
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Blur loading={loading} />
      {trajets.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: 'black' }}>
            Aucun trajet disponible dans votre entourage.
            </Text>
            </View>
            ) : (
            <FlatList
            data={trajets}
            renderItem={renderTrajet}
            keyExtractor={(item) => item.id}
            />
            )}
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
  encoursButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
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