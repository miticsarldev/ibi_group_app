import { auth, db } from "@/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { setUser, clearUser } from "@/reduxfordriver/slices/userSlice";
import { Dispatch } from "@reduxjs/toolkit"; 
import { personne } from "@/interface/personne";
import { router } from "expo-router";
import { Alert } from "react-native";

// Inscription d'un nouvel utilisateur
export const Create = async (personne: personne, dispatch: Dispatch) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, personne.email, personne.password);
    const user = userCredential.user;

    const userRef = doc(db, "personne", user.uid);
    await setDoc(userRef, {
      fullName: personne.fullName,
      email: user.email,
      contact: personne.contact,
      gender: personne.gender,
      referral: personne.referral ?? null,
      promoCode: personne.promoCode ?? null,
      permis: personne.permis ?? null,
      identiter: personne.identiter ?? null,
      role: personne.role,
      dateCreate: new Date().toISOString(),
      isActif: true,
    });
    
    // Mettre à jour l'état global Redux
    dispatch(
      setUser({
        uid: user.uid,
        email: user.email,
        role: personne.role,
      })
    );
    console.log("Inscription réussie pour :", user.email);
    // Connexion automatique après l'inscription
    return await Login(personne.email, personne.password, dispatch);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de l'inscription :", error.message);
      throw new Error(error.message);
    } else {
      console.error("Erreur inconnue lors de l'inscription :", error);
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};

// Connexion d'un utilisateur
export const Login = async (email: string, password: string, dispatch: Dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, "personne", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const token = await user.getIdToken();

      // Mettre à jour l'état global Redux
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          role: userData.role,
        })
      );

      // Redirection basée sur le rôle utilisateur
      switch (userData.role) {
        case "Utilisateur":
          router.push("/(Utilisateurs)/(tabs)/home");
          break;
        case "Chauffeur Personnel":
          router.push("/(Driver)/trajet");
          break;
        case "Chauffeur IBI":
          router.push("/(Driver)/location");
          break;
        default:
          Alert.alert("Rôle utilisateur inconnu. Veuillez contacter l'administrateur.", "error");
      }
      return { user, token, role: userData.role };
    } else {
      throw new Error("Utilisateur non trouvé dans Firestore.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de la connexion :", error.message);
      throw new Error(error.message);
    } else {
      console.error("Erreur inconnue lors de la connexion :", error);
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};

// Déconnexion de l'utilisateur
export const Deconnexion = async (dispatch: Dispatch) => {
  try {
    await signOut(auth);

    // Effacer l'état utilisateur dans Redux
    dispatch(clearUser());

    console.log("Déconnexion réussie");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de la déconnexion :", error.message);
      throw new Error(error.message);
    } else {
      console.error("Erreur inconnue lors de la déconnexion :", error);
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};

//donnéer de l'utilisateur connecter 
export const getUserInfo = async () => {
  const userId = auth.currentUser?.uid;
  if (userId) {
    const userDoc = doc(db, "personne", userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data(); 
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } else {
    throw new Error("Utilisateur non connecté");
  }
};