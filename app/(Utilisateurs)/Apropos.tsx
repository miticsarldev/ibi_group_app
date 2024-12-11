import { View, Text, StyleSheet} from 'react-native'
import React from 'react'

const Apropos = () => {
    const handleBackPress = () => {
        
      };
  return (
    <View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.header}> Aprops</Text>
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
    </View>
  )
}
const styles = StyleSheet.create({

contentContainer: {
    marginTop: 30,
    alignSelf: "center",
  },
  header:{
    marginBottom:30,
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    fontSize: 20,
    fontWeight: 'bold',

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