import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '@/constants/styles'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { vehicule } from '@/interface/vehicule';
import { useSearchParams } from 'expo-router/build/hooks';
import  { fetchVehiculeDetails, createReservation }  from '@/services/reservationService'; 
import ToastMessage from '@/components/ToastMessage';

const DemandeVoiture = () => {
  const searchParams = useSearchParams(); 
  const [vehiculeId, setVehiculeId] = useState<string | null>(null);
  const [vehiculeType, setVehiculeType] = useState<string | null>(null);
  const [vehiculeDetails, setVehiculeDetails] = useState<vehicule | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('startDate');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); 
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    try {
      const id = searchParams.get('id');
      const type = searchParams.get('type');
  
      console.log('Paramètres reçus:', { id, type });
  
      if (id && type) {
        setVehiculeId(id);
        setVehiculeType(type);
        console.log('Véhicule ID:', id);
        console.log('Véhicule Type:', type);
      } else {
        alert('Aucun véhicule sélectionné.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres :', error);
      alert('Une erreur est survenue lors de la récupération des informations.');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (vehiculeId) {
          const details = await fetchVehiculeDetails(vehiculeId);
          setVehiculeDetails(details as vehicule);
          console.log('Détails du véhicule récupérés :', details);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du véhicule :', error);
      }
    };

    fetchDetails();
  }, [vehiculeId]);

  const tarifHoraire = 500;

  const handleConfirmDate = (date:any) => {
    const formattedDate = date.toISOString().split('T')[0]; 
    if (currentPicker === 'startDate') setStartDate(formattedDate);
    if (currentPicker === 'endDate') setEndDate(formattedDate);
    setDatePickerVisibility(false);
  };
  
  const handleConfirmTime = (time:any) => {
    const formattedTime = time.toTimeString().split(' ')[0].substring(0, 5);
    if (currentPicker === 'startTime') setStartTime(formattedTime);
    if (currentPicker === 'endTime') setEndTime(formattedTime);
    setTimePickerVisibility(false);
  };

  const calculateTotalAmount = () => {
    if (!startDate || !startTime || !endDate || !endTime) return;
  
    // Combine date and time into a valid ISO format
    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${endDate}T${endTime}:00`);
  
    // Validate that end time is after start time
    if (start >= end) {
      alert('La date de fin doit être après la date de début.');
      setTotalAmount(0);
      return;
    }
  
    // Calculer la différence en heures
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 3600);
  
    // Calculer le montant total
    const amount = diffInHours * tarifHoraire;
    setTotalAmount(Number(amount.toFixed(2)));
  };

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      calculateTotalAmount();
    }
  }, [startDate, startTime, endDate, endTime]);


  const handleSubmit = async () => {
    try {
      if (vehiculeId && vehiculeDetails) {
        const reservationData = {
          totalMontant: totalAmount,
          dateDebut: startDate,
          heureDebut: startTime,
          dateFin: endDate,
          heureFin: endTime
        };
        const result = await createReservation(vehiculeId, reservationData);
        setToastMessage(result);
        setToastType('success');
        setToastVisible(true);
        setTimeout(() => {
          router.push("/(Driver)/suceessDemande");
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error);
      setToastMessage('Impossible de créer la réservation.');
      setToastType('error');
      setToastVisible(true);
    }
  };

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
            editable={false}
          />
          <TouchableOpacity onPress={() => { setCurrentPicker('startDate'); setDatePickerVisibility(true); }}>
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
            editable={false}
          />
          <TouchableOpacity onPress={() => { setCurrentPicker('startTime'); setTimePickerVisibility(true); }}>
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
            editable={false}
          />
          <TouchableOpacity onPress={() => { setCurrentPicker('endDate'); setDatePickerVisibility(true); }}>
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
            editable={false}
          />
          <TouchableOpacity onPress={() => { setCurrentPicker('endTime'); setTimePickerVisibility(true); }}>
            <Ionicons name="time" size={24} color="#E0DBD5" />
          </TouchableOpacity>
        </View>

              {/* Picker Modals */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
      />

        {/* Montant à payer */}
        <View style={styles.hr} />
        <View style={styles.paymentSection}>
          <Text style={styles.paymentText}>Montant à payer : <Text style={styles.amount}>{totalAmount} CFA</Text></Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Créer la réservation</Text>
      </TouchableOpacity>

      {/* Toast Message */}
      <ToastMessage message={toastMessage} type={toastType} visible={toastVisible} onHide={() => setToastVisible(false)} />
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
    width: "100%",
    color: "#000",
    textAlign: "center", 
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,padding: 12
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

