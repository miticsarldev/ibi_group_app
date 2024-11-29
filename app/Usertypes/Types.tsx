import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Types = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
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
        onPress={() => router.push('/UserLogin/Inscription')} 
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
        onPress={() => router.push('')} 
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
});

export default Types;
