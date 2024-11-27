import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Screen2 = () => {

  const handleNext = () => {
    router.navigate('/Onboarding/Bienvenue'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image source={require('../../assets/image/trajet.png')} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Trajet</Text>
        <Text style={styles.subtitle}>
        suivez vos trajets en direct pour une experiance riche et unique 
        </Text>
      </View>

      <TouchableOpacity style={styles.outerCircle} onPress={handleNext}>
        <View style={styles.innerCircle}>
          <Text style={styles.buttonText}>GO</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CFF2EC', // Couleur du cercle extérieur
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    margin: 80,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#52D5BA', // Couleur du cercle intérieur
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Screen2;
