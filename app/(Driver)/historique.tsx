import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, Alert } from "react-native";  
import { COLORS } from "@/constants/styles";
import { getHistoriqueTrajets } from "@/services/historiqueTrajetService";
import { historiqueTrajet } from "@/interface/historiqueTrajet";
import { getAuth } from "firebase/auth";

const HistoriqueScreen = () => {
  const [trajets, setTrajets] = useState<historiqueTrajet[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const totalMontant = trajets.reduce((acc, trajet) => acc + (trajet.montant || 0), 0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getHistoriqueTrajets(user.uid)
        .then(setTrajets)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const renderItem = ({ item }: { item: historiqueTrajet }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionText}>
          {item.depart} ➡ {item.destination}
        </Text>
        <Text style={styles.timeText}>{ item.createdAt }</Text>
      </View>
      <Text style={styles.amountText}>{item.montant ? `${item.montant} CFA` : "Montant inconnu"}</Text>
    </View>
  );

  return (
    <View style={styles.container}> 
      {isLoading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : (
        <>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>{totalMontant} CFA</Text>
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







// import React, { useState } from "react";
// import { View, FlatList, StyleSheet, Text } from "react-native";  
// import { COLORS } from "@/constants/styles";
// import { getHistoriqueTrajets } from "@/services/historiqueTrajetService";

// type Transaction = {
//   id: string;
//   from: string;
//   to: string;
//   amount: string;
//   time: string;
// };

// const HistoriqueScreen = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//     console.log("Sidebar toggled:", isSidebarOpen);
//   };

//   const transactions: Transaction[] = [
//     { id: "1", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
//     { id: "2", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
//     { id: "3", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
//   ];

//   const renderItem = ({ item }: { item: Transaction }) => (
//     <View style={styles.card}>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.transactionText}>
//           {item.from} ➡ {item.to}
//         </Text>
//         <Text style={styles.timeText}>{item.time}</Text>
//       </View>
//       <Text style={styles.amountText}>{item.amount}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}> 

//       {/* Total Realized */}
//       <View style={styles.totalContainer}>
//         <Text style={styles.totalAmount}>50 000 CFA</Text>
//         <Text style={styles.totalLabel}>Total réalisé</Text>
//       </View>

//       {/* Transaction List */}
//       <FlatList
//         data={transactions}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         style={{ marginTop: 40 }} 
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF", 
//     paddingHorizontal: 20,
//     // paddingVertical: 20, 
//     paddingTop: 20,
//   },
//   totalContainer: {
//     backgroundColor: "#D1FAE5",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 5,  
//   },
//   totalAmount: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.primary,
//   },
//   totalLabel: {
//     fontSize: 14,
//     color: COLORS.primary,
//   },
//   listContainer: {
//     paddingBottom: 10,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//   },
//   transactionText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#374151",
//   },
//   timeText: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginTop: 5,
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     textAlign: "right",
//     marginLeft: 10,
//   },
// });

// export default HistoriqueScreen;
