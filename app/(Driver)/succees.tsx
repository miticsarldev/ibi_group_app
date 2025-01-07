import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../constants/styles';

const Succees = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    router.navigate('/(Driver)/trajet'); 
  }

  return (
    <View style={styles.container}> 

      {/* Image en haut */}
      <Image source={require('../../assets/image/sucess.png')} style={styles.image} />

      {/* Text centré */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Votre inscription a été réussie avec succès !</Text>
        <Text style={styles.subtitle}>
          Nous vous remercions de vous être inscrit. Votre compte est actuellement en attente de validation par notre équipe de support. Vous recevrez une notification dès que votre compte sera confirmé.
          Merci pour votre patience !
        </Text>
      </View>

      {/* Bouton en bas */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Quitter</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  buttonText: { 
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});

export default Succees;
