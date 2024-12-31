import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../constants/styles';

const SucceesDemande = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    router.navigate('/(Driver)/location'); 
  }

  return (
    <View style={styles.container}> 

      {/* Image en haut */}
      <Image source={require('../../assets/image/sucess.png')} style={styles.image} />

      {/* Text centré */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Votre location a été réussie avec succès !</Text>
        <Text style={styles.subtitle}>
          Vous pouvez passer à l’agence le 24/12/2024 à 
          8h00 pour récupérer la voiture avec vos pièces d’identité !
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
    marginTop: 35,
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

export default SucceesDemande;
