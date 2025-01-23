import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal, ActivityIndicator } from "react-native";
import { COLORS, FONTS, SIZES } from "@/constants/styles"; 
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { useSearchParams } from "expo-router/build/hooks";
import { Create } from '@/services/authService'; 
import Blur from "@/components/loader";
import { router } from "expo-router";

const Inscription = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const [showPromoField, setShowPromoField] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!role) {
    return (
      <View>
        <Text>Erreur : Aucun rôle sélectionné.</Text>
      </View>
    );
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    identityURL: "",
    driverLicenseURL: "",
    gender: "",
    referral: "",
    promoCode: "",
  });

  const handleImagePicker = (field: "identityURL" | "driverLicenseURL") => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          handleInputChange(field, uri);
        } else {
          Alert.alert("Error", "No valid image URI found.");
        }
      } else {
        Alert.alert("Error", "No image selected.");
      }
    });
  };

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (key === "referral" && value === "Personne") {
      setShowPromoField(true);
    } else if (key === "referral") {
      setShowPromoField(false);
    }
  }; 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async () => {
    if (!acceptTerms) {
      Alert.alert("Erreur", "Vous devez accepter les conditions pour continuer.");
      return;
    } 

    if (formData.password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);

    // Validation des champs
    const requiredFields = ["fullName", "email", "contact", "password", "gender"];
    const isValid = requiredFields.every((field) => formData[field as keyof typeof formData]);

    if (!isValid) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const personne = {
      ...formData,
      referral: formData.referral || null,
      promoCode: formData.promoCode || null,
      permis: formData.driverLicenseURL || null,
      identiter: formData.identityURL || null,
      role,
    };

    try {
      await Create(personne);
      Alert.alert("Succès", "Inscription réussie !");
      setTimeout(() => {
        router.push("/(Driver)/trajet");
      }, 500);
    } catch (error:any) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <ScrollView style={styles.container}  contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}>
      <View style={styles.innerContainer}></View>
      {loading && <Blur loading={loading}/>}
      <Text style={styles.title}>Inscription</Text>

      {/* Nom Complet */}
      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      {/* Mot de passe */}
      <View style={styles.inputWithButton}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Mot de passe"
        secureTextEntry={!isPasswordVisible}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <Ionicons
          name={isPasswordVisible ? "eye-off" : "eye"}
          size={24}
          color="#414141"
          style={styles.buttonInsideIcone}
        />
      </TouchableOpacity>
    </View> 

      {/* Phone Input */}
      <View style={styles.phoneInputContainer}>
      <Image
          source={{ uri: 'https://flagcdn.com/w40/ml.png' }}
          style={styles.flag}
        />
        <Text style={styles.countryCode}>+223</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Votre numéro"
          keyboardType="phone-pad"
          value={formData.contact}
          onChangeText={(text) => setFormData({ ...formData, contact: text })}
        />
      </View>

      {/* Genre Selection */} 
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(text) => setFormData({ ...formData, gender: text })}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez le genre" value="" />
          <Picker.Item label="Homme" value="Homme" />
          <Picker.Item label="Femme" value="Femme" />
        </Picker>
      </View>

      {role === 'Chauffeur IBI' && (
        <>
          {/* Pièce d'identité */}
          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.input3}
              placeholder="Ajouter l'URL de la pièce d'identité"
              value={formData.identityURL}
              onChangeText={(text) => handleInputChange("identityURL", text)}
              placeholderTextColor="#898989"
            />
            <TouchableOpacity
              style={styles.buttonInsideInput}
              onPress={() => handleImagePicker("identityURL")}
            >
              <Text style={styles.buttonText2}>Insérer</Text>
            </TouchableOpacity>
          </View>

          {/* Permis de conduire */}
          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.input3}
              placeholder="Ajouter l'URL du permis de conduire"
              value={formData.driverLicenseURL}
              onChangeText={(text) => handleInputChange("driverLicenseURL", text)}
              placeholderTextColor="#898989"
            />
            <TouchableOpacity
              style={styles.buttonInsideInput}
              onPress={() => handleImagePicker("driverLicenseURL")}
            >
              <Text style={styles.buttonText2}>Insérer</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      

      {/* Condition et Support */}
      <Text style={styles.sectionTitle}>Comment avez-vous connu cette plateforme ?</Text>
      <View style={styles.radioGroup}>
        {["LinkedIn", "Facebook", "Personne", "Autres"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => handleInputChange("referral", option)}
          >
            <View
              style={[
                styles.radioCircle,
                formData.referral === option && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Code Promo */}
      {showPromoField && (
        <TextInput
          style={styles.input}
          placeholder="Code promo"
          value={formData.promoCode}
          onChangeText={(text) => handleInputChange("promoCode", text)}
        />
      )}

      {/* Acceptation des conditions */}
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)}>
          <View
            style={[
              styles.checkbox,
              acceptTerms && { backgroundColor: COLORS.primary },
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.termsText}>
          En vous inscrivant, vous acceptez les{" "}
          <Text style={styles.link} onPress={() => setModalVisible(true)}>
            Conditions d'utilisation
          </Text>{" "}
          et la{" "}
          <Text style={styles.link} onPress={() => setModalVisible(true)}>
            Politique de confidentialité
          </Text>
          .
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Pop Up Acceptation des conditions */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conditions d'utilisation</Text>
            <ScrollView>
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
                nisi. Nulla quis sem at nibh elementum imperdiet.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: SIZES.padding * 2,
  },
  innerContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16, 
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.paddingSmall,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: 5,
    flex: 1,
    paddingRight: SIZES.iconSize * 2, 
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 15,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 2,
  },
  countryCode: {
    fontSize: SIZES.font,
    marginLeft: 2,
  },
  phoneInput: {
    flex: 1, 
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    marginBottom: 15,
  },
  inputWithButton: {
    marginBottom: SIZES.paddingSmall,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  buttonInsideInput: {
    position: "absolute",
    right: SIZES.base,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base + 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonInsideIcone: {
    position: "absolute",
    right: SIZES.base,
    top: "50%",
    transform: [{ translateY: -40 }],
    backgroundColor: COLORS.white,
    paddingVertical: 1,
    paddingHorizontal: SIZES.base + 2,
    borderRadius: SIZES.radius,
  },
  buttonText2: {
    color: COLORS.darkGray,
    fontSize: SIZES.font - 4,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SIZES.paddingSmall,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base,
    gap: 6,
    width: "48%",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: SIZES.iconSize / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#6C6C6C',
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center", 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#6C6C6C', 
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    width: "80%",
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.fontLarge,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  modalText: {
    fontSize: SIZES.font - 2,
    color: COLORS.text,
  },
  closeButton: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base + 2,
    paddingHorizontal: SIZES.padding,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: SIZES.radius,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font - 2,
    fontFamily: FONTS.medium,
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
  },
  input3: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 5,
    paddingRight: 100,
    fontSize: 14,
    color: "#333",               
    marginBottom: 5,
  },
  radioText: {
    fontSize: 12,
    color: COLORS.text,
    marginRight: 8,
  },
  picker: {
    borderWidth: 0, 
  },
  termsText: {
    fontSize: 14, 
    paddingRight: 14,
    color: COLORS.text,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  }, 
        
});

export default Inscription;



// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Checkbox from 'expo-checkbox';
// import { useRouter } from 'expo-router';

// const Inscription = () => {
//   const router = useRouter();

//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [gender, setGender] = useState('');
//   const [isChecked, setIsChecked] = useState(false);

//   const handleSignup = () => {
//     if (!fullName || !email || !phoneNumber || !gender || !isChecked) {
//       Alert.alert('Erreur', 'Veuillez remplir tous les champs et accepter les conditions.');
//       return;
//     }
    
//     // router.push('/Login'); // Navigue vers la page de connexion
//   };

//   return (
//     <View style={styles.container}>
//       {/* Bouton retour */}
//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Text style={styles.backText}>← Retour</Text>
//       </TouchableOpacity>

//       {/* Titre */}
//       <Text style={styles.title}>Inscription</Text>

//       {/* Formulaire */}
//       <TextInput
//         style={styles.input}
//         placeholder="Nom Complet"
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Adresse mail"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <View style={styles.phoneInputContainer}>
//         <Image
//           source={{ uri: 'https://flagcdn.com/w40/ml.png' }} // Drapeau (par défaut Mali)
//           style={styles.flag}
//         />
//         <Text style={styles.countryCode}>+223</Text>
//         <TextInput
//           style={styles.phoneInput}
//           placeholder="Votre numéro"
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />
//       </View>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={gender}
//           onValueChange={(itemValue) => setGender(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Genre" value="" />
//           <Picker.Item label="Homme" value="Homme" />
//           <Picker.Item label="Femme" value="Femme" />
//         </Picker>
//       </View>

//       {/* Checkbox et conditions */}
//       <View style={styles.checkboxContainer}>
//         <Checkbox
//           value={isChecked}
//           onValueChange={setIsChecked}
//           color={isChecked ? '#34C759' : undefined}
//         />
//         <Text style={styles.checkboxText}>
//           En vous inscrivant, vous acceptez les{' '}
//           <Text >Conditions d'utilisation</Text> et la{' '}
//           <Text >Politique de confidentialité</Text>.
//         </Text>
//       </View>

//       {/* Bouton d'inscription */}
//       <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
//         <Text style={styles.signupButtonText}>S'inscrire</Text>
//       </TouchableOpacity>

//       {/* Lien vers connexion */}
//       <View style={styles.loginContainer}>
//         <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
//         <TouchableOpacity onPress={() => router.push('/(UserLogin)/Connexion')}>
//             <Text style={styles.loginLink}> Connectez-vous</Text>
//         </TouchableOpacity>
//         </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   backButton: {
//     marginBottom: 20,
//   },
//   backText: {
//     fontSize: 16,
//     color: '#000000',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   phoneInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 20,
//   },
//   flag: {
//     width: 24,
//     height: 16,
//     marginRight: 10,
//   },
//   countryCode: {
//     fontSize: 16,
//     color: '#000000',
//     marginRight: 10,
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   picker: {
//     height: 50,
//     fontSize: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   checkboxText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#6C6C6C',
//     flex: 1,
//     flexWrap: 'wrap',
//   },

//   signupButton: {
//     backgroundColor: '#34C759',
//     borderRadius: 8,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   signupButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#6C6C6C',
//   },
//   loginLink: {
//     fontSize: 14,
//     color: '#34C759',
//     textDecorationLine: 'underline',
//     marginLeft: 5,
//   },
// });

// export default Inscription;
