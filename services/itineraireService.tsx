import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Trajet } from "@/interface/trajet";

export const fetchItineraire = async (trajetId: string): Promise<Trajet | null> => {
  try {
    const trajetRef = doc(db, "trajets", trajetId);
    const trajetDoc = await getDoc(trajetRef);

    if (!trajetDoc.exists()) {
      console.error("Trajet introuvable");
      return null;
    }

    return trajetDoc.data() as Trajet;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'itinéraire :", error);
    throw error;
  }
};

export const validateOtp = async (trajetId: string, enteredOtp: string): Promise<boolean> => {
  try {
    const trajetRef = doc(db, "trajets", trajetId);
    const trajetDoc = await getDoc(trajetRef);

    if (!trajetDoc.exists()) {
      console.error("Trajet introuvable");
      return false;
    }

    const itineraire = trajetDoc.data() as Trajet;

    if (itineraire.otpCode === enteredOtp) {
      await updateDoc(trajetRef, { status: "otp_validated" }); // Statut mis à jour
      return true;
    } else {
      console.error("Code OTP invalide");
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la validation OTP :", error);
    throw error;
  }
};

export const updateItineraireStatus = async (
  trajetId: string,
  status: "ongoing" | "completed"
) => {
  try {
    const trajetRef = doc(db, "trajets", trajetId);
    await updateDoc(trajetRef, { status });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut d'itinéraire :", error);
    throw error;
  }
};
