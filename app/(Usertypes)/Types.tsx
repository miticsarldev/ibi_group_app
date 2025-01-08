import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';

const Types = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const handleCarSelection = () => {
    setModalVisible(true);
  };

  const handleNavigate = (role:any) => {
    if (!role) {
      alert('Veuillez sélectionner un rôle valide.');
      return;
    }
    setModalVisible(false);
    router.push({
      pathname: '/(UserLogin)/Inscription',
      params: { role },
    });
  };

  return (
    <View style={styles.container}> 
      <Image
        source={require('../../assets/image/Logo.png')} 
        style={styles.logo}
      />

      {/* Titre principal */}
      <Text style={styles.title}>IBI GROUP</Text>
      <Text style={styles.subtitle}>Choisissez votre types d’utilisateur</Text>

      {/* Carte 1 : Utilisateur */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleNavigate('Utilisateur')}
      >
        <Image
          source={require('../../assets/image/utilisateur.jpg')}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Utilisateur</Text>
          <Text style={styles.cardDescription}>
            Faites vos trajets en toute sécurité
          </Text>
        </View>
      </TouchableOpacity>

      {/* Carte 2 : Chauffeur */}
      <TouchableOpacity
        style={styles.card}
        onPress={handleCarSelection} 
      >
        <Image
          source={require('../../assets/image/chauffeur.jpg')}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Chauffeur</Text>
          <Text style={styles.cardDescription}>
            Trouver facilement des clients à proximité
          </Text>
        </View>
      </TouchableOpacity>

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
                onPress={() => handleNavigate('Chauffeur IBI')}
              >
                <Image
                  source={require('../../assets/image/voiture.png')}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>IBI Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, styles.optionPersonal]}
                onPress={() => handleNavigate('Chauffeur Personnel')}
              >
                <Image
                  source={require('../../assets/image/personnel.png')}
                  style={styles.optionImage}
                />
                <Text style={styles.optionText}>Personnel</Text>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C6C6C',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardTextContainer: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6C6C6C',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
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
    justifyContent: 'space-between',
  },
  optionCard: {
    width: 120,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  optionIBI: {
    backgroundColor: '#DFF5E1',
  },
  optionPersonal: {
    backgroundColor: '#F5F5F5',
  },
  optionImage: {
    width: 90,
    height: 60,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Types;
