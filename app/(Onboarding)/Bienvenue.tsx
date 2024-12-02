import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Bienvenue = () => {

  const handleNext = () => {
    router.navigate('/(Usertypes)/Types');
  };
  const handleNextt = () => {
    router.navigate('/(UserLogin)/Connexion'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image source={require('../../assets/image/welcom.png')} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>
        Bénéficiez d'une meilleure expérience de partage
        </Text>
      </View>

      <TouchableOpacity  onPress={handleNext}>
        <View style={styles.innerCircle}>
          <Text style={styles.buttonText}>Crée un compte</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity  onPress={handleNextt}>
        <View style={styles.innerCirclee}>
          <Text style={styles.buttonTextt}>Se connecter</Text>
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

  innerCircle: {
    marginTop:50,
    width: 350,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#0FAC71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCirclee: {
    marginTop:30,
    width: 350,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor:'#0FAC71',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: 'light',
  },
  buttonTextt: {
    fontSize: 17,
    color: '#0FAC71',
    fontWeight: 'light',
  },
});

export default Bienvenue;
