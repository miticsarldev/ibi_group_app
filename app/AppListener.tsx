import { useEffect } from 'react';
import { query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useDispatch } from 'react-redux';
import { showRatingModal } from '@/Redux/slices/ratingslice';

const AppListener = () => {
  const dispatch = useDispatch();
  const userId = 'userId';

  useEffect(() => {
    const q = query(collection(db, 'trajet'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const tripData = change.doc.data();
          const previousTripData = change.doc.metadata.hasPendingWrites ? null : change.doc.metadata.fromCache ? null : change.doc.data();

          console.log('Changement détecté dans le trajet :', change.doc.id, 'Statut :', tripData.status);

          // Vérifier si le statut est passé à "terminer" 
          if (tripData.status === 'terminer' ) {
            console.log('Trajet terminé trouvé :', change.doc.id);
            console.log('Dispatching showRatingModal...');
            dispatch(showRatingModal({ tripId: change.doc.id }));
        }
        }
      });
    });

    return () => unsubscribe();
  }, [dispatch, userId]);

  return null;
};

export default AppListener;