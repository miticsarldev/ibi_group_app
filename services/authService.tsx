import { auth, db } from "@/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

interface personne {
  fullName: string,
  email: string;
  password: string;
  gender: string,
  contact: string;
  referral: string | null;
  promoCode: string | null;
  identiter: string | null;
  permis: string | null;
  role: string;
}

// Inscription d'un nouvel utilisateur avec email et mot de passe
export const Create = async (personne: personne) => {
  try {
    // Créer l'utilisateur avec Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, personne.email, personne.password);
    const user = userCredential.user;

    // Ajouter des informations supplémentaires dans Firestore
    const userRef = doc(db, 'personne', user.uid);
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

    console.log("Inscription réussie pour :", user.email);
    return user;
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

// Connexion d'un utilisateur avec email et mot de passe

export const Login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log("Connexion réussie :", user.email);
    return { user, token };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login ou mot de passe invalid");
      throw new Error(error.message);
    } else {
      console.error("Erreur inconnue lors de la connexion :", error);
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};


// Déconnexion de l'utilisateur

export const Deconnexion = async () => {
  try {
    await signOut(auth);
    console.log("Déconnexion réussie");
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
