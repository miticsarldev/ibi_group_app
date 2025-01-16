import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { historiqueTrajet } from "@/interface/historiqueTrajet";

export const createHistoriqueTrajet = async (historique: historiqueTrajet): Promise<void> => {
  try {
    const historiqueRef = collection(db, "historiqueTrajet");
    await addDoc(historiqueRef, historique);
  } catch (error) {
    console.error("Erreur lors de la création de l'historique :", error);
    throw new Error("Impossible de créer l'historique du trajet");
  }
};
