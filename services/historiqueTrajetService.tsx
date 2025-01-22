import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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

export const getHistoriqueTrajets = async (chauffeurId: string): Promise<historiqueTrajet[]> => {
  try {
    const trajetsRef = collection(db, "historiqueTrajet");
    const q = query(trajetsRef, where("chauffeurId", "==", chauffeurId), where("statut", "==", "Terminer"));
    const querySnapshot = await getDocs(q);

    const trajets: historiqueTrajet[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        trajets.push({ trajetId: doc.id, ...doc.data() } as historiqueTrajet);
      }
    });

    return trajets;
  } catch (error) {
    console.error("Erreur lors de la récupération des trajets:", error);
    return [];
  }
};

