import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { vehicule } from "@/interface/vehicule";

export const initializeVehicules = async (): Promise<void> => {

    // Initialise la collection de véhicules avec des valeurs par défaut si elle est vide.
  const vehicules: vehicule[] = [
    {
      id: "1",
      matricule: "CC 7889 MD",
      distance: "70Km",
      personnes: 5,
      prix: "5 000CFA /jour",
      type: "voiture",
      image: "https://drive.google.com/uc?export=view&id=1Pir6Lni2gTYufUu0ur1_p-JvSn4SKXZV",
      disponible: true
    },
    {
      id: "2",
      matricule: "CC 7800 MD",
      distance: "700Km",
      personnes: 5,
      prix: "5 500CFA /jour",
      type: "voiture", 
      image: "https://drive.google.com/uc?export=view&id=1Pir6Lni2gTYufUu0ur1_p-JvSn4SKXZV",
      disponible: true
    },
    {
      id: "3",
      matricule: "CC 9989 MD",
      distance: "70Km",
      personnes: 2,
      prix: "2 500CFA /jour",
      type: "moto",
      image: "https://drive.google.com/uc?export=view&id=1m72_cI8fKYlxROwd1PorgAUXh_c80623",
      disponible: true
    },
  ];

  try {
    const collectionRef = collection(db, "vehicule");
    const snapshot = await getDocs(collectionRef);

    console.log("Nombre de documents dans la collection:", snapshot.size);
    if (snapshot.empty) {
      console.log("La collection 'Vehicule' est vide. Initialisation en cours...");
      
      // Ajouter chaque véhicule dans la collection
      for (const vehicule of vehicules) {
        const docRef = doc(collectionRef, vehicule.id); // Utilise `vehicule.id` comme identifiant
        await setDoc(docRef, vehicule);
        console.log(`Véhicule ajouté : ${vehicule.matricule}`);
      }

      console.log("Initialisation terminée avec succès.");
    } else {
      console.log("Les données existent déjà. Aucune action n'est nécessaire.");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation des véhicules :", error);
  }
};

// Récupère tous les véhicules depuis Firestore.
export const fetchVehicules = async (): Promise<vehicule[]> => {
    const collectionRef = collection(db, "vehicule");
    const snapshot = await getDocs(collectionRef);
  
    const vehicles: vehicule[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as vehicule[];
  
    return vehicles;
  };


  /**
 * Met à jour la disponibilité d'un véhicule.
 * @param id ID du véhicule.
 * @param available Nouveau statut de disponibilité.
 */
export const updateVehiculeAvailability = async (
    id: string,
    disponible: boolean
  ): Promise<void> => {
    const docRef = doc(db, "vehicule", id);
    await setDoc(docRef, { disponible }, { merge: true });
  };

//  Récupère les véhicules disponibles uniquement.
export const fetchAvailableVehicules = async (): Promise<vehicule[]> => {
    const allVehicules = await fetchVehicules();
    return allVehicules.filter((vehicule) => vehicule.disponible);
  };