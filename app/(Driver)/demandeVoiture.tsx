import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../constants/styles';

const DemandeVoiture = () => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <View style={styles.container}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(Driver)/location")}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choisissez vos jours</Text>
      </View> 

      <View style={styles.inputContainer}>

        {/* Date de début */}
        <Text style={styles.label}>Date de début</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="JJ/MM/AAAA"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TouchableOpacity onPress={() => console.log('Ouvrir le calendrier')}>
            <Ionicons name="calendar" size={24} color="#E0DBD5" />
          </TouchableOpacity>
        </View> 

        {/* Heure de début */}
        <Text style={styles.label}>Heure de début</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="HH/MM"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TouchableOpacity onPress={() => console.log('Ouvrir l\'horloge')}>
            <Ionicons name="time" size={24} color="#E0DBD5" />
          </TouchableOpacity>
        </View>

        {/* Date de fin */}
        <Text style={styles.label}>Date de fin</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="JJ/MM/AAAA"
            value={endDate}
            onChangeText={setEndDate}
          />
          <TouchableOpacity onPress={() => console.log('Ouvrir le calendrier')}>
            <Ionicons name="calendar" size={24} color="#E0DBD5" />
          </TouchableOpacity>
        </View>

        {/* Heure de fin */}
        <Text style={styles.label}>Heure de fin</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="HH/MM"
            value={endTime}
            onChangeText={setEndTime}
          />
          <TouchableOpacity onPress={() => console.log('Ouvrir l\'horloge')}>
            <Ionicons name="time" size={24} color="#E0DBD5" />
          </TouchableOpacity>
        </View>

        {/* Montant à payer */}
        <View style={styles.hr} />
        <View style={styles.paymentSection}>
          <Text style={styles.paymentText}>Montant à payer : <Text style={styles.amount}>5 000 CFA</Text></Text>
        </View>
        <View style={styles.hr} />

        {/* Mode de paiement */}
        <Text style={styles.paymentLabel}>Mode de paiement :</Text>
        <View style={styles.paymentMethods}>
          <View style={styles.radioButton}>
            <Image source={require('../../assets/image/hands.png')} style={styles.icon} />
            <Text style={styles.radioText}>Espèces</Text>
            <Checkbox
              value={paymentMethod === 'Espèces'}
              onValueChange={() => setPaymentMethod('Espèces')}
              color="#1EBA62"
            />
          </View>
          <View style={styles.radioButton}>
            <Image source={require('../../assets/image/orange.webp')} style={styles.icon} />
            <Text style={styles.radioText}>Orange Money</Text>
            <Checkbox
              value={paymentMethod === 'Orange Money'}
              onValueChange={() => setPaymentMethod('Orange Money')}
              color="#1EBA62"
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(Driver)/suceessDemande")}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginLeft: 10,
    width: "100%",
    color: "#000",
    textAlign: "center", 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#374151',
  },
  inputContainer: {
    paddingTop: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  hr: {
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  paymentSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 18,
    color: COLORS.primary,
  },
  paymentLabel: {
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: "center"
  },
  paymentMethods: {
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SIZES.padding,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLarge,
    fontFamily: FONTS.bold,
  }
});

export default DemandeVoiture;
