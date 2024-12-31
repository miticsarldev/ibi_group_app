import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text
} from "react-native";  
import { COLORS } from "../../constants/styles";
type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: string;
  time: string;
};

const HistoriqueScreen = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    console.log("Sidebar toggled:", isSidebarOpen);
  };

  const transactions: Transaction[] = [
    { id: "1", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
    { id: "2", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
    { id: "3", from: "Sotuba", to: "Yirimadjo", amount: "3500F", time: "Il y’a 20 mins" },
  ];

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionText}>
          {item.from} ➡ {item.to}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.amountText}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}> 

      {/* Total Realized */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalAmount}>50 000 CFA</Text>
        <Text style={styles.totalLabel}>Total réalisé</Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        style={{ marginTop: 40 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
    paddingHorizontal: 20,
    // paddingVertical: 20, 
    paddingTop: 20,
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
