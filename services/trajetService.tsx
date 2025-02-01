import { doc, updateDoc, getFirestore, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { trajet } from "@/interface/trajet";
import { personne } from "@/interface/personne";
import { historiqueTrajet } from "@/interface/historiqueTrajet"; 
import { get, getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

const db1 = getDatabase();

// Récupère les trajets disponibles dans un rayon de 3 km.
// export const fetchTrajetsInRadius = async (
//   chauffeurLat: number,
//   chauffeurLon: number
// ): Promise<trajet[]> => {
//   const tempsLimit = new Date(Date.now() - 3600 * 1000);
//   try {
//     const trajetsRef = ref(db1, "trajets");
//     const snapshot = await get(trajetsRef);
//     if (!snapshot.exists()) return [];

//     const trajets: trajet[] = Object.entries(snapshot.val()).map(([id, data]) => ({
//       id,
//       ...(data as trajet),
//     }));

//     console.log("Trajets disponibles avant filtrage :", trajets);

//     // Filtrer les trajets avec un statut "Encours" 
//     const trajetsDisponibles = trajets.filter((trajet) => {
//       const createdAtDate = trajet.createAt?.toDate();
//       return trajet.status === "Encours" && createdAtDate >= tempsLimit;
//     });
//         console.log("Trajets avec status 'Encours' :", trajetsDisponibles);
//     // const trajetsDisponibles = trajets.filter((trajet) => trajet.status === "Encours");

//     // Filtrer les trajets dans un rayon de 3 km
//     const trajetsInRadius = trajetsDisponibles.filter((trajet) => {
//       const distance = calculateDistance(
//         chauffeurLat,
//         chauffeurLon,
//         trajet.userLocation.latitude,
//         trajet.userLocation.longitude
//       );

//       console.log(`Distance pour le trajet ${trajet.id} :`, distance);
//       return distance <= 3;
//     });

//     console.log("Trajets dans le rayon :", trajetsInRadius);
//     return trajetsInRadius;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des trajets :", error);
//     return [];
//   }
// };

export const fetchTrajetsInRadius = async (
  chauffeurLat: number, 
  chauffeurLon: number
): Promise<trajet[]> => {
  // Rayon de la Terre en km
  const R = 6371; 
  // Rayon de recherche en km
  const maxDistance = 3;
  const tempsLimit = new Date(Date.now() - 3600 * 1000);

  try {
    const collectionRef = collection(db, "trajet");
    const snapshot = await getDocs(collectionRef); 

    console.log("Nombre de trajets récupérés :", snapshot.docs.length);

    // Map des trajets en typant explicitement les données extraites
    const trajets: trajet[] = snapshot.docs
      .map((doc) => {
        const data = doc.data() as trajet;
        return { ...data, id: doc.id };
      })
      console.log("Trajets disponibles avant filtrage :", trajets);

    // Filtrer uniquement les trajets avec un status "Encours" 
    const trajetsDisponibles = trajets.filter((trajet) => { 
      return trajet.status === "Encours" && trajet.createdAt.toDate() >= tempsLimit;
    });
    console.log("Trajets avec status 'Encours' :", trajetsDisponibles);

    // Filtrer les trajets dans un rayon de 3 km
    const trajetsInRadius = trajetsDisponibles.filter((trajet) => {
      const distance = calculateDistance(
        chauffeurLat,
        chauffeurLon,
        trajet.userLocation.latitude,
        trajet.userLocation.longitude
      );
      
      console.log(`Distance pour le trajet ${trajet.id} :`, distance);
      return distance <= maxDistance;
    }); 
    
    console.log("Trajets dans le rayon :", trajetsInRadius);

    return trajetsInRadius;
  } catch (error) {
    console.error("Erreur lors de la récupération des trajets :", error);
    return [];
  }
};

//Calcule la distance entre deux points GPS en km.
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const R = 6371; // Rayon de la Terre en km
  return R * c;
};
const estimateArrivalTime = (distance: number, type: string): string => {
  let speed = type === "moto" ? 40 : 60; // Vitesse en km/h (moto 40 km/h, voiture 60 km/h)
  let timeInHours = distance / speed;
  let timeInMinutes = Math.ceil(timeInHours * 60);

  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + timeInMinutes);

  return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const updateTrajetStatus = async (trajetId: string, status: "accepter" | "terminer", chauffeurId?: string) : Promise<void> => {
  try {
    const trajetRef = doc(db, "trajet", trajetId);
    const updateData: any = { status };
    
    if (chauffeurId) {
      updateData.chauffeurId = chauffeurId;
    }

    await updateDoc(trajetRef, updateData);
    console.log(`Status du trajet ${trajetId} mis à jour avec succès à "${status}"`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du status du trajet :", error);
    throw error;
  }
};

// Fonction pour récupérer un trajet et l'utilisateur associé
export const fetchTrajet = async (trajetId: string): Promise<{ trajet: trajet | null, personne: personne | null }> => {
  if (!trajetId) throw new Error("Aucun trajetId fournis");

  try {
    const trajetRef = doc(db, "trajet", trajetId);
    const trajetSnap = await getDoc(trajetRef);

    if (!trajetSnap.exists()) return { trajet: null, personne: null };

    const trajetData = trajetSnap.data() as trajet;

    let personneData: personne | null = null;
    if (trajetData.userId) {
      const personneRef = doc(db, "personne", trajetData.userId);
      const personneSnap = await getDoc(personneRef);
      if (personneSnap.exists()) {
        personneData = personneSnap.data() as personne;
      }
    }

    return { trajet: trajetData, personne: personneData };
  } catch (error) {
    console.error("Erreur lors de la récupération du trajet :", error);
    return { trajet: null, personne: null };
  }
};

// Fonction pour terminer un trajet et créer un historique
export const terminerTrajet = async (trajetId: string) => {
  if (!trajetId) throw new Error("Aucun trajetId fourni");
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non connecté.');
  }

  try {
    // Mettre à jour le statut du trajet à "Terminer"
    const trajetRef = doc(db, "trajet", trajetId);
    await updateDoc(trajetRef, { status: "terminer" });

    // Ajouter un historique du trajet
    const historique: historiqueTrajet = {
      trajetId,
      chauffeurId : user.uid, 
    };
    await addDoc(collection(db, "historiqueTrajet"), historique);
    console.log("Trajet terminé et ajouté à l'historique");
  } catch (error) {
    console.error("Erreur lors de la finalisation du trajet :", error);
  }
};

export const verifierOtpTrajet = async (trajetId: string, otpSaisi: string) => {
  try {
    const db = getFirestore();
    const trajetRef = doc(db, "trajet", trajetId);
    const trajetSnap = await getDoc(trajetRef);

    if (!trajetSnap.exists()) {
      throw new Error("Trajet introuvable !");
    }

    const trajetData = trajetSnap.data();
    if (trajetData.otp === otpSaisi) {
      return { success: true };
    } else {
      return { success: false, message: "OTP incorrect" };
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP :", error);
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const refuserTrajetStatus = async (trajetId: string, status: "annuler", chauffeurId?: string) : Promise<void> => {
  try {
    const trajetRef = doc(db, "trajet", trajetId);
    const updateData: any = { status };
    
    if (chauffeurId) {
      updateData.chauffeurId = chauffeurId;
    }

    await updateDoc(trajetRef, updateData);
    console.log(`Status du trajet ${trajetId} mis à jour avec succès à "${status}"`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du status du trajet :", error);
    throw error;
  }
};
 