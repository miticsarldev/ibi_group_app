import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { station } from "@/interface/station"

// Fonction pour initialiser les stations si la collection est vide
export const initialiserStation = async (): Promise<void> => {
    const stations: station[] = [
      {
        id: "1",
        latitude: 12.0,
        longitude: -8.0,
        adresse: "Quartier 1, Ville", 
        capacite: 1234
      },
      {
        id: "2",
        latitude: 12.005,
        longitude: -8.004,
        adresse: "Quartier 2, Ville",
        capacite: 2000
      },
      {
        id: "3",
        latitude: 12.010,
        longitude: -8.007,
        adresse: "Quartier 3, Ville",
        capacite: 25000
      },
      {
        id: "4",
        latitude: 12.015,
        longitude: -8.011,
        adresse: "Quartier 4, Ville",
        capacite: 45000
      },
      {
        id: "5",
        latitude: 12.020,
        longitude: -8.015,
        adresse: "Quartier 5, Ville",
        capacite: 67000
      }
    ];
  
    try {
      const collectionRef = collection(db, "station");
      const snapshot = await getDocs(collectionRef);
  
      if (snapshot.empty) {
        console.log("La collection 'station' est vide. Initialisation en cours...");
  
        for (const station of stations) {
          const docRef = doc(collectionRef, station.id);
          await setDoc(docRef, station);
          console.log(`Station ajoutée : ${station.id}`);
        }
  
        console.log("Initialisation des stations terminée avec succès.");
      } else {
        console.log("Les données existent déjà dans 'station'. Aucune action nécessaire.");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des stations :", error);
    }
  };


// Récupérer toutes les stations depuis Firestore
export const getStations = async (): Promise<station[]> => {
  try {
    const snapshot = await getDocs(collection(db, "station"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as station));
  } catch (error) {
    console.error("Erreur lors de la récupération des stations :", error);
    return [];
  }
};
