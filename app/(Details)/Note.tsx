// RateDoctorScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { hideRatingModal } from '@/Redux/slices/ratingslice';

const RateDoctorScreen = () => {
  const dispatch = useDispatch();
  const { tripId, isModalVisible } = useSelector((state) => state.rating);
  console.log('RateDoctorScreen - tripId:', tripId);
  console.log('RateDoctorScreen - isModalVisible:', isModalVisible);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const onSubmitRating = async () => {
    if (selectedRating === null) {
      Alert.alert('Erreur', 'Veuillez sélectionner une note avant de soumettre.');
      return;
    }

    setIsLoading(true);

    try {
      const tripRef = doc(db, 'trajet', tripId);
      await updateDoc(tripRef, {
        rating: selectedRating,
      });

      Alert.alert('Succès', 'Merci d’avoir noté ce trajet !');
      dispatch(hideRatingModal());
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note :', error);
      Alert.alert('Erreur', 'Une erreur s’est produite lors de la notation du trajet.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSkip = () => {
    dispatch(hideRatingModal()); 
  };
  console.log('RateDoctorScreen rendu, isModalVisible:', isModalVisible);

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => dispatch(hideRatingModal())}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/image/sucess.png')}
              style={styles.successIcon}
            />
          </View>
          <Text style={styles.title}>Vous êtes arrivé à destination</Text>
          <Text style={styles.subtitle}>Merci d’avoir choisi IBI GROUP</Text>
          <Text style={styles.ratingPrompt}>Voulez-vous noter ce trajet ?</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => handleRating(rating)}
                style={[
                  styles.ratingIcon,
                  selectedRating === rating && styles.selectedRatingIcon,
                ]}
              >
                <Text style={styles.emoji}>
                  {rating === 1
                    ? '😡'
                    : rating === 2
                    ? '😕'
                    : rating === 3
                    ? '😊'
                    : rating === 4
                    ? '😃'
                    : '😁'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={onSubmitRating}
              disabled={selectedRating === null || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Noter</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.buttonText}>Passer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // top: 180,
    // left: 30,    
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  ratingPrompt: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  ratingIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  selectedRatingIcon: {
    backgroundColor: '#28a745',
  },
  emoji: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  skipButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RateDoctorScreen;