import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
const Apropos = () => {
    const handleBackPress = () => {
        
      };
  return (
      
      <View style={styles.container}>
      {/* Barre de navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apropos</Text>
      </View>
      <View style={styles.illustration}>
            <Image source={require('../../assets/image/question.png')} />
            </View>
        <Text style={styles.contentText}>
          Plateforme de covoiturage professionnelle. Ici, nous ne vous
          fournirons que du contenu intéressant, que vous apprécierez beaucoup.
          Nous nous engageons à vous offrir le meilleur du covoiturage, en
          mettant l'accent sur la fiabilité et les revenus. Nous travaillons à
          transformer notre passion pour le covoiturage en un site Web en ligne
          en plein essor. Nous espérons que vous apprécierez nos covoiturages
          autant que nous aimons vous les proposer. 
        </Text>
      </View>

  )
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 110,
    color: "#000",
  },
  illustration: {
    alignItems: "center",
    margin: 25,
  },
  contentText: {
    color: "#5A5A5A",
    textAlign: "justify",
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 24,
  },
});
export default Apropos