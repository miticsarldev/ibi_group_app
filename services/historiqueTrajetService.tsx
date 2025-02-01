import { collection, addDoc, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { historiqueTrajet } from "@/interface/historiqueTrajet";
import { trajet } from "@/interface/trajet";

export const getHistoriqueTrajets = async (chauffeurId: string): Promise<trajet[]> => {
  try {
    // 🔹 Récupération des historiques de trajet pour le chauffeur
    const historiqueRef = collection(db, "historiqueTrajet");
    const q = query(historiqueRef, where("chauffeurId", "==", chauffeurId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

    const trajets: trajet[] = [];

    // 🔹 Boucle sur chaque historique pour récupérer les détails du trajet
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data() as historiqueTrajet; 
      const trajetDocRef = doc(db, "trajet", data.trajetId);
      const trajetDocSnap = await getDoc(trajetDocRef);

      if (trajetDocSnap.exists()) {
        const trajetData = trajetDocSnap.data() as trajet; // 🔹 Cast explicite en trajet
        trajets.push({ id: trajetDocSnap.id, ...trajetData });
      }
    }

    return trajets;
  } catch (error) {
    console.error("Erreur lors de la récupération des trajets:", error);
    return [];
  }
};

