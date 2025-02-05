import React, { createContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    const tripId = "TRAJET_ID"; // Remplace par l'ID du trajet actuel
    const tripRef = doc(db, "trajet", tripId);

    const unsubscribe = onSnapshot(tripRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const tripData = docSnapshot.data();
        setCurrentTrip(tripData);

        // Vérifie si le statut est "accepté" et affiche la popup
        if (tripData.status === "accepté") {
          setShowRatingModal(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <TripContext.Provider value={{ currentTrip, showRatingModal, setShowRatingModal }}>
      {children}
    </TripContext.Provider>
  );
};
