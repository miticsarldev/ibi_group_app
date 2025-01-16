import { collection, getDocs, doc, setDoc, updateDoc, getFirestore, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { trajet } from "@/interface/trajet";
import { getAuth } from 'firebase/auth';  

// Initialise la collection `trajet` avec des valeurs par défaut si elle est vide.
export const initializeTrajets = async (): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non connecté.');
  }
  const trajets: trajet[] = [
    {
      id: "1",
      personneId: user.uid,
      clientLat: 12.0,
      clientLon: -8.0,
      destinationLat: 12.1,
      destinationLon: -8.1,
      destination: "kati",
      type: "voiture",
      nmbrePers: 3,
      prix: 4000,
      otpCode: "12345",
      statut: "diponible",
      dateCreate: new Date().toISOString()
    },
    {
      id: "2",
      personneId: user.uid,
      clientLat: 12.05,
      clientLon: -8.02,
      destinationLat: 12.15,
      destinationLon: -8.12,
      destination: "kati",
      type: "moto",
      nmbrePers: 2,
      prix: 500,
      otpCode: "65432",
      statut: "diponible",
      dateCreate: new Date().toISOString()
    },
    {
      id: "3",
      personneId: user.uid, 
      clientLat: 12.621,
      clientLon: -8.035,
      destinationLat: 12.622,
      destinationLon: -8.034,
      destination: "kati",
      type: "voiture",
      nmbrePers: 1,
      prix: 5000,
      otpCode: "98765",
      statut: "diponible",
      dateCreate: new Date().toISOString()
    },
    {
      id: "4",
      personneId: user.uid, 
      clientLat: 12.621,
      clientLon: -8.035,
      destinationLat: 12.622,
      destinationLon: -8.034,
      destination: "katiyer",
      type: "moto",
      nmbrePers: 2,
      prix: 5000,
      otpCode: "98765",
      statut: "diponible",
      dateCreate: new Date().toISOString()
    },
    {
      id: "5",
      personneId: user.uid, 
      clientLat: 12.587,
      clientLon: -8.027,
      destinationLat: 13.000,
      destinationLon: -7.500,
      destination: "katima",
      type: "moto",
      nmbrePers: 2,
      prix: 5000,
      otpCode: "98765",
      statut: "diponible",
      dateCreate: new Date().toISOString(),
    },
    {
      id: "6",
      personneId: user.uid, 
      clientLat: 12.587,
      clientLon: -8.027,
      destinationLat: 12.590,
      destinationLon: -8.025,
      destination: "knati",
      type: "voiture",
      nmbrePers: 2,
      prix: 5000,
      otpCode: "98765",
      statut: "diponible",
      dateCreate: new Date().toISOString(),
    }
  ];

  try {
    const collectionRef = collection(db, "trajet");
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      console.log("La collection 'trajet' est vide. Initialisation en cours...");

      for (const trajet of trajets) {
        const docRef = doc(collectionRef, trajet.id);
        await setDoc(docRef, trajet);
        console.log(`Trajet ajouté : ${trajet.id}`);
      }

      console.log("Initialisation des trajets terminée avec succès.");
    } else {
      console.log("Les données existent déjà dans 'trajet'. Aucune action nécessaire.");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation des trajets :", error);
  }
};

// Récupère les trajets disponibles dans un rayon de 3 km.
export const fetchTrajetsInRadius = async (
  chauffeurLat: number, 
  chauffeurLon: number
): Promise<trajet[]> => {
  const R = 6371; // Rayon de la Terre en km
  const maxDistance = 3; // Rayon de recherche en km

  try {
    const collectionRef = collection(db, "trajet");
    const snapshot = await getDocs(collectionRef);

    console.log("Nombre de trajets récupérés :", snapshot.docs.length);

    // Map des trajets en typant explicitement les données extraites
    const trajets: trajet[] = snapshot.docs
      .map((doc) => {
        const data = doc.data() as trajet; // Cast explicite
        return { ...data, id: doc.id }; // Ajoute `id` sans duplication
      })
      console.log("Trajets disponibles avant filtrage :", trajets);

    // Filtrer uniquement les trajets avec un statut "disponible"
    const trajetsDisponibles = trajets.filter((doc) => doc.statut === "diponible");
    console.log("Trajets avec statut 'disponible' :", trajetsDisponibles);

    // Filtrer les trajets dans un rayon de 3 km
    const trajetsInRadius = trajetsDisponibles.filter((trajet) => {
      const distance = calculateDistance(
        chauffeurLat,
        chauffeurLon,
        trajet.clientLat,
        trajet.clientLon
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

export const updateTrajetStatus = async (trajetId: string, statut: "accepter") : Promise<void> => {
  try {
    const trajetRef = doc(db, "trajet", trajetId);
    await updateDoc(trajetRef, { statut }); 
    console.log(`Statut du trajet ${trajetId} mis à jour avec succès à "${statut}"`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de trajet :", error);
    throw error;
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
    if (trajetData.otpCode === otpSaisi) {
      return { success: true };
    } else {
      return { success: false, message: "OTP incorrect" };
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP :", error);
    return { success: false, message: "Une erreur est survenue" };
  }
};

// import { db } from "@/firebaseConfig";
// import { trajet } from "@/interface/trajet";
// import { getAuth } from 'firebase/auth'; 
// import { AppDispatch } from '@/redux/store';
// import { setLoading, setError, setTrajets, updateTrajetStatut  } from '@/redux/slices/trajetSlice';

// // Initialise la collection `trajet` avec des valeurs par défaut si elle est vide.
// export const initializeTrajets = () => async (dispatch: AppDispatch): Promise<void> => {
//   dispatch(setLoading(true));
//   try{
//     const auth = getAuth();
//     const user = auth.currentUser;
  
//     if (!user) {
//       throw new Error('Utilisateur non connecté.');
//     }
//     const trajets: trajet[] = [
//     {
//       id: "1",
//       personneId: user.uid,
//       clientLat: 12.0,
//       clientLon: -8.0,
//       destinationLat: 12.1,
//       destinationLon: -8.1,
//       destination: "kati",
//       type: "voiture",
//       nmbrePers: 3,
//       prix: 4000,
//       otpCode: "123456",
//       statut: "diponible",
//       dateCreate: new Date().toISOString()
//     },
//     {
//       id: "2",
//       personneId: user.uid,
//       clientLat: 12.05,
//       clientLon: -8.02,
//       destinationLat: 12.15,
//       destinationLon: -8.12,
//       destination: "kati",
//       type: "moto",
//       nmbrePers: 2,
//       prix: 500,
//       otpCode: "654321",
//       statut: "diponible",
//       dateCreate: new Date().toISOString()
//     },
//     {
//       id: "3",
//       personneId: user.uid, 
//       clientLat: 12.621,
//       clientLon: -8.035,
//       destinationLat: 12.622,
//       destinationLon: -8.034,
//       destination: "kati",
//       type: "voiture",
//       nmbrePers: 1,
//       prix: 5000,
//       otpCode: "987654",
//       statut: "diponible",
//       dateCreate: new Date().toISOString()
//     },
//     {
//       id: "4",
//       personneId: user.uid, 
//       clientLat: 12.621,
//       clientLon: -8.035,
//       destinationLat: 12.622,
//       destinationLon: -8.034,
//       destination: "kati",
//       type: "moto",
//       nmbrePers: 2,
//       prix: 5000,
//       otpCode: "987654",
//       statut: "diponible",
//       dateCreate: new Date().toISOString()
//     },
//     ]; 
//     const collectionRef = collection(db, "trajet");
//     const snapshot = await getDocs(collectionRef);

//     if (snapshot.empty) {
//       console.log("La collection 'trajet' est vide. Initialisation en cours...");

//       for (const trajet of trajets) {
//         const docRef = doc(collectionRef, trajet.id);
//         await setDoc(docRef, trajet);
//         console.log(`Trajet ajouté : ${trajet.id}`);
//       }
//       dispatch(setLoading(false));
//       console.log("Initialisation des trajets terminée avec succès.");
//     } else {
//       console.log("Les données existent déjà dans 'trajet'. Aucune action nécessaire.");
//     }
//   } catch (error) {
//     console.error("Erreur lors de l'initialisation des trajets :", error);
//   }
// };

// // Récupère les trajets disponibles dans un rayon de 3 km.
// export const fetchTrajetsInRadius = (chauffeurLat: number, chauffeurLon: number) => async (dispatch: AppDispatch): Promise<void> => {
//   dispatch(setLoading(true));
//   const R = 6371; // Rayon de la Terre en km
//   const maxDistance = 3; // Rayon de recherche en km

//   try {
//     const collectionRef = collection(db, "trajet");
//     const snapshot = await getDocs(collectionRef);

//     console.log("Nombre de trajets récupérés :", snapshot.docs.length);

//     // Map des trajets en typant explicitement les données extraites
//     const trajets: trajet[] = snapshot.docs
//       .map((doc) => {
//         const data = doc.data() as trajet; // Cast explicite
//         return { ...data, id: doc.id }; // Ajoute `id` sans duplication
//       })
//       console.log("Trajets disponibles avant filtrage :", trajets);

//     // Filtrer uniquement les trajets avec un statut "disponible"
//     const trajetsDisponibles = trajets.filter((doc) => doc.statut === "diponible");
//     console.log("Trajets avec statut 'disponible' :", trajetsDisponibles);

//     // Filtrer les trajets dans un rayon de 3 km
//     const trajetsInRadius = trajetsDisponibles.filter((trajet) => {
//       const distance = calculateDistance(
//         chauffeurLat,
//         chauffeurLon,
//         trajet.clientLat,
//         trajet.clientLon
//       );
//       console.log(`Distance pour le trajet ${trajet.id} :`, distance);
//       return distance <= maxDistance;
//     });
    
//     console.log("Trajets dans le rayon :", trajetsInRadius);

//     dispatch(setTrajets(trajetsInRadius));
//   } catch (error:any) {
//     dispatch(setError(error.message || "Une erreur s'est produite"));
//   } finally {
//     dispatch(setLoading(false));
//   } 
// };

// //Calcule la distance entre deux points GPS en km.
// const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const toRadians = (deg: number) => (deg * Math.PI) / 180;

//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const R = 6371; // Rayon de la Terre en km
//   return R * c;
// };

// export const updateTrajetStatus = async (trajetId: string, statut: "accepter") => async (dispatch: AppDispatch) : Promise<void> => {
//   dispatch(setLoading(true));
//   try {
//     const trajetRef = doc(db, "trajet", trajetId);
//     await updateDoc(trajetRef, { statut }); 
//     console.log(`Statut du trajet ${trajetId} mis à jour avec succès à "${statut}"`);
//     dispatch(updateTrajetStatut({ id: trajetId, statut }));
//   } catch (error:any) {
//     dispatch(setError(error.message || "Une erreur s'est produite"));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };