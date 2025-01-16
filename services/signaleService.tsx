import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { signalement } from '@/interface/signale';

// Fonction pour envoyer un signalement à Firestore
export const createSignalement = async (signalement: signalement): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'signalement'), signalement);
    console.log(`Signalement enregistré avec succès, ID : ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du signalement :', error);
    throw new Error('Impossible d\'enregistrer le signalement.');
  }
};
