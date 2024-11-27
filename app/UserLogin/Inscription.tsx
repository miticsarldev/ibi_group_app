import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';

const Inscription = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSignup = () => {
    if (!fullName || !email || !phoneNumber || !gender || !isChecked) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et accepter les conditions.');
      return;
    }
    
    // router.push('/Login'); // Navigue vers la page de connexion
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      {/* Titre */}
      <Text style={styles.title}>Inscription</Text>

      {/* Formulaire */}
      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.phoneInputContainer}>
        <Image
          source={{ uri: 'https://flagcdn.com/w40/ml.png' }} // Drapeau (par défaut Mali)
          style={styles.flag}
        />
        <Text style={styles.countryCode}>+223</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Votre numéro"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Genre" value="" />
          <Picker.Item label="Homme" value="Homme" />
          <Picker.Item label="Femme" value="Femme" />
        </Picker>
      </View>

      {/* Checkbox et conditions */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? '#34C759' : undefined}
        />
        <Text style={styles.checkboxText}>
          En vous inscrivant, vous acceptez les{' '}
          <Text style={styles.link}>Conditions d'utilisation</Text> et la{' '}
          <Text style={styles.link}>Politique de confidentialité</Text>.
        </Text>
      </View>

      {/* Bouton d'inscription */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Lien vers connexion */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
        <TouchableOpacity onPress={() => router.push('/UserLogin/Connexion')}>
            <Text style={styles.loginLink}> Connectez-vous</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    color: '#000000',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6C6C6C',
    flex: 1,
    flexWrap: 'wrap',
  },

  signupButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#6C6C6C',
  },
  loginLink: {
    fontSize: 14,
    color: '#34C759',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
});

export default Inscription;
