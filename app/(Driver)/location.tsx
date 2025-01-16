import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "@/constants/styles";
import { fetchAvailableVehicules, initializeVehicules } from "@/services/vehiculeService";
import { fetchUserRentalStatus } from '@/services/reservationService';
import { vehicule } from "@/interface/vehicule";
import Blur from "@/components/loader";

const Location = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<vehicule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasActiveRental, setHasActiveRental] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVehicule, setSelectedVehicule] = useState<vehicule | null>(null); 
  const [selectedType, setSelectedType] = useState<string | null>(null); 

  // // Simulation de récupération de l'état de location de l'utilisateur connecté
  // const fetchUserRentalStatus = async (): Promise<boolean> => {
  //   // Remplacez cette partie par une requête à votre backend ou service
  //   // Ex. : const response = await fetchRentalStatus(userId);
  //   // Ici, on suppose qu'on vérifie simplement dans Firestore.
  //   return false; // Retourne "true" si une location est active.
  // };

  useEffect(() => {
    const loadVehiclesAndStatus = async () => {
      setLoading(true); 
      try {
        const userHasRental = await fetchUserRentalStatus();
        setHasActiveRental(userHasRental);

        await initializeVehicules(); 

        if (!userHasRental) {
          const vehiculeDisponibles = await fetchAvailableVehicules();
          setVehicles(vehiculeDisponibles);
        }      
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules et du statut de réservation :', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehiclesAndStatus();
  }, []);

  const handleCarSelection = (vehicule: vehicule) => {
    setSelectedVehicule(vehicule);
    console.log('Paramètres envoyés:', { id: vehicule.id, type: 'moto' });
    if (vehicule.type === "moto") {  
      router.push(`/(Driver)/demandeVoiture?id=${vehicule.id}&type=moto`);

    } else { 
      setModalVisible(true);
    }
  };

    const handleTypeSelection = (type: string) => {
      if (selectedVehicule) {  
        console.log('Paramètres envoyés:', { id: selectedVehicule.id, type });
        router.push(`/(Driver)/demandeVoiture?id=${selectedVehicule.id}&type=${encodeURIComponent(type)}`);
      }
      setModalVisible(false);
    };

  const renderVehicle = ({ item }: { item: vehicule }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}> 
        <View style={styles.details}>
          <View style={styles.matriculeContainer}>
            <Text style={styles.matriculeLabel}>Matricule :</Text>
            <Text style={styles.matricule}>{item.matricule}</Text>
          </View>
          <Text style={styles.info}>{item.distance} | {item.personnes} prs | {item.prix}</Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      {/* Bouton de réservation */}
      <TouchableOpacity onPress={() => handleCarSelection(item)} style={styles.reserveButton}>
        <Text style={styles.reserveText}>Réserver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Blur loading={loading} />

      {hasActiveRental ? (
        <View style={styles.activeRentalContainer}>
          <Text style={styles.activeRentalText}>
            Vous avez déjà une location en cours. Veuillez la terminer avant d'en louer une autre.
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Pop-up Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Type Voiture</Text>
            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionIBI]}
                onPress={() => handleTypeSelection('Mission')}
              >
                <Image
                  source={require("../../assets/image/mission.png")}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Mission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionPersonal]}
                onPress={() => handleTypeSelection('Livraison')}
              >
                <Image
                  source={require("../../assets/image/livraision.png")}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Livraison</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionIBI]}
                onPress={() => handleTypeSelection('Transport')}
              >
                <Image
                  source={require("../../assets/image/trans.png")}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Transport</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionPersonal]}
                onPress={() => handleTypeSelection('Autres')}
              >
                <Image
                  source={require("../../assets/image/over.png")}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Autres</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Location; 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    padding: 16,
  },
  activeRentalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeRentalText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flexShrink: 1,
    maxWidth: '70%',
  },
  matriculeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matriculeLabel: {
    color: COLORS.text,
    fontSize: 16,
    marginRight: 4,
  },
  matricule: {
    fontWeight: 'bold',
    fontSize: 16, 
  },
  info: {
    color: '#6B6B6B',
    fontSize: 14,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  reserveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 310,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  modalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionCard: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', 
    margin: 10,
    backgroundColor: '#DFF5E1',
  },
  optionImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionIBI: {
    backgroundColor: '#DFF5E1',
  },
  optionPersonal: {
    backgroundColor: '#DFF5E1',
  }
});

// export default Location;
