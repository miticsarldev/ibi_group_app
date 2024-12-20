import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ParametersScreen = ({ navigation }: { navigation: any }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState("");

  // Menu items
  const menuItems = [
    {
      label: "Modifier votre profil",
      icon: "person-outline" as const ,
      action: () => router.push("/(Driver)/profil"),
    },
    {
      label: "Changer de mot de passe",
      icon: "lock-closed-outline" as const ,
      action: () => router.push("/(Driver)/editPassword"),
    },
    {
      label: "À propos",
      icon: "information-circle-outline" as const ,
      action: () => openModal("Voici les informations sur cette application."),
    },
    {
      label: "Support",
      icon: "headset-outline" as const ,
      action: () => openModal("Contactez-nous à support@example.com."),
    },
    {
      label: "FAQ",
      icon: "help-circle-outline" as const ,
      action: () => openModal("Questions fréquemment posées."),
    },
    {
      label: "Parrainage",
      icon: "people-outline" as const ,
      action: () => router.push("/(Driver)/parrainage")
    },
  ];

  // Open a modal with specific content
  const openModal = (content: string) => {
    setCurrentModalContent(content);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}> 
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Supprimer votre compte</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{currentModalContent}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "#10B981",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuIconContainer: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  deleteButton: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F87171" as const ,
    borderRadius: 8,
    alignItems: "center" as const ,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#FF0000" as const ,
    fontWeight: "bold" as const ,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ParametersScreen;
