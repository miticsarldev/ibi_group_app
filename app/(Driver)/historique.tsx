import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";  
import { COLORS } from "@/constants/styles";
import { getHistoriqueTrajets } from "@/services/historiqueTrajetService"; 
import { getAuth } from "firebase/auth";
import { trajet } from "@/interface/trajet";

const HistoriqueScreen = () => {
  const [trajets, setTrajets] = useState<trajet[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const totalMontant = trajets.reduce((acc, trajet) => {
    const priceNumber = parseFloat(trajet.price?.replace(/[^0-9.-]+/g, "") || "0");
    return acc + priceNumber;
  }, 0);
  const auth = getAuth();
  const user = auth.currentUser;

useEffect(() => {
  if (user?.uid) {
    setIsLoading(true);
    getHistoriqueTrajets(user.uid) 
      .then((result) => {
        setTrajets(result);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des trajets:", error);
      })
      .finally(() => setIsLoading(false));
  }
}, [user?.uid]);

  const renderItem = ({ item }: { item: trajet }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionText}>
          {item.userLocation?.address} ➡ {item.destination?.address}
        </Text>
        <Text style={styles.timeText}>
         {item.createdAt?.toDate().toLocaleString() || "Date inconnue"}
        </Text>
      </View>
      <Text style={styles.amountText}>{item.price ? `${item.price}` : "Montant inconnu"}</Text>
    </View>
  );

  return (
    <View style={styles.container}> 
      {isLoading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : (
        <>
        <View style={styles.totalContainer}> 
          <Text style={styles.totalAmount}>
           {totalMontant ? `${totalMontant} CFA` : "Montant inconnu"}
          </Text>
          <Text style={styles.totalLabel}>Total réalisé</Text>
        </View>

        <FlatList
          data={trajets}
          renderItem={renderItem}
          keyExtractor={(item) => item.trajetId}
          contentContainerStyle={styles.listContainer}
          style={{ marginTop: 40 }} 
        />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
    paddingHorizontal: 20,  
    paddingTop: 20,
  },
  loadingText: { 
    fontSize: 16, 
    color: COLORS.primary, 
    textAlign: "center", 
    marginTop: 20 
  },
  totalContainer: {
    backgroundColor: "#D1FAE5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 5,  
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.primary,
  },
  listContainer: {
    paddingBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  timeText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "right",
    marginLeft: 10,
  },
});

export default HistoriqueScreen;