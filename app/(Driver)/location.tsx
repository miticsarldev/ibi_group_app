import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router'; 
import { COLORS, SIZES } from '../../constants/styles';

interface Vehicle {
    id: number;
    matricule: string;
    distance: string;
    personnes: number;
    prix: string;
    image: any;
  }

// Données des véhicules
const vehicles = [
  {
    id: 1,
    matricule: 'CC 7889 MD',
    distance: '70Km',
    personnes: 5,
    prix: '5 000CFA /jours',
    image: require('../../assets/image/voiture.png'),
  },
  {
    id: 2,
    matricule: 'CC 7800 MD',
    distance: '700Km',
    personnes: 5,
    prix: '5 500CFA /jours',
    image: require('../../assets/image/voiture.png'),
  },
  {
    id: 3,
    matricule: 'CC 9989 MD',
    distance: '70Km',
    personnes: 2,
    prix: '2 500CFA /jours',
    image: require('../../assets/image/moto.png'),
  },
];
 

const Location = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

const handleCarSelection = () => {
  setModalVisible(true);
};

const handleNavigate = () => {
  setModalVisible(false);
  router.push('/(Driver)/demandeVoiture');
}

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Informations principales */}
        <View style={styles.details}>  
          <View style={styles.matriculeContainer}>
            <Text style={styles.matriculeLabel}>Matricule :</Text>
            <Text style={styles.matricule}>{item.matricule}</Text>  
          </View>
          <Text style={styles.info}>{item.distance} | {item.personnes} prs | {item.prix} </Text>
        </View>
        <Image source={item.image} style={styles.image} />
      </View>

      {/* Bouton de réservation */}
      <TouchableOpacity onPress={handleCarSelection} style={styles.reserveButton}>
        <Text style={styles.reserveText}>Réserver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id.toString()}
      />

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
                onPress={handleNavigate}
              >
                <Image
                  source={require('../../assets/image/mission.png')}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Mission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionPersonal]}
                onPress={handleNavigate}
              >
                <Image
                  source={require('../../assets/image/livraision.png')}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Livraision</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionIBI]}
                onPress={handleNavigate}
              >
                <Image
                  source={require('../../assets/image/trans.png')}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Transport</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionPersonal]}
                onPress={handleNavigate}
              >
                <Image
                  source={require('../../assets/image/over.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    padding: 16,
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

export default Location;
