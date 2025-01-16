import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { reservation } from '@/interface/reservation';
import { getAuth } from 'firebase/auth';

//charger les données du véhicule selectionner a partir de l'id
export const fetchVehiculeDetails = async (id: string) => {
  try {
    const vehiculeRef = doc(db, 'vehicule', id);
    const vehiculeSnap = await getDoc(vehiculeRef);

    if (vehiculeSnap.exists()) {
      return vehiculeSnap.data();
    } else {
      console.error('Aucun véhicule trouvé avec cet ID.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du véhicule :', error);
    throw error;
  }
};


// Ajouter une réservation avec les données sélectionnées
export const createReservation = async (vehiculeId: string, reservationData: Partial<reservation>): Promise<string> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    // Charger les détails du véhicule
    const vehiculeDetails = await fetchVehiculeDetails(vehiculeId);

    if (!vehiculeDetails) {
      throw new Error('Détails du véhicule introuvables.');
    }

    // Construire la réservation
    const newReservation: reservation = { 
      personneId: user.uid,
      vehiculeId,
      totalMontant: reservationData.totalMontant || 0,
      type: vehiculeDetails.type || 'Inconnu',
      dateDebut: reservationData.dateDebut || '',
      heureDebut: reservationData.heureDebut || '',
      dateFin: reservationData.dateFin || '',
      heureFin: reservationData.heureFin || '',
      status: 'Encours',
    };

    // Ajouter la réservation à Firestore
    const docRef = await addDoc(collection(db, 'reservation'), newReservation);
    return `Réservation créée avec succès, ID : ${docRef.id}`;
  } catch (error) {
    console.error('Erreur lors de la création de la réservation :', error);
    throw new Error('Impossible de créer la réservation.');
  }
};

// Vérifie si l'utilisateur a une réservation "Encours" ou "Confirmer"
export const fetchUserRentalStatus = async (): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    // Requête pour récupérer les réservations de l'utilisateur avec les statuts spécifiques
    const reservationsRef = collection(db, 'reservation');
    const q = query(
      reservationsRef,
      where('personneId', '==', user.uid),
      where('status', 'in', ['Encours', 'Confirmer'])
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erreur lors de la vérification des réservations actives :', error);
    throw error;
  }
};


export const fetchUserRentalDetails = async (): Promise<{ hasActiveReservation: boolean; vehiculeId?: string }> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    const reservationsRef = collection(db, 'reservation');
    const q = query(
      reservationsRef,
      where('personneId', '==', user.uid),
      where('status', 'in', ['Encours', 'Confirmer'])
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const reservation = querySnapshot.docs[0].data(); // Supposons qu'il y a une seule réservation active
      return { hasActiveReservation: true, vehiculeId: reservation.vehiculeId };
    }

    return { hasActiveReservation: false };
  } catch (error) {
    console.error('Erreur lors de la vérification des réservations actives :', error);
    throw error;
  }
};
