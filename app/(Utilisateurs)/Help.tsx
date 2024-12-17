import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Help = () => {
  const [activeTab, setActiveTab] = useState("Questions");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleQuestion = (question: string) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide et support</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Questions" && styles.activeTab]}
          onPress={() => setActiveTab("Questions")}
        >
          <Text style={[styles.tabText, activeTab === "Questions" && styles.activeTabText]}>
            Question
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Contacts" && styles.activeTab]}
          onPress={() => setActiveTab("Contacts")}
        >
          <Text style={[styles.tabText, activeTab === "Contacts" && styles.activeTabText]}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.content}>
        {activeTab === "Questions" ? (
          <ScrollView>
            
            <View style={styles.illustration}>
            <Image source={require('../../assets/image/question.png')} />
            </View>
            <Text style={styles.sectionTitle}>Question fréquente</Text>

            
            {[
              {
                question: "Comment récupérer mes objets perdus ?",
                answer:
                  "Pour les objets perdus, veuillez contacter le service client dans les paramètres de l'application.",
              },
              {
                question: "Comment devenir chauffeur ?",
                answer:
                  "Veuillez visiter notre site web pour plus d'informations sur les étapes pour devenir chauffeur.",
              },
              {
                question: "Comment voir mes historiques ?",
                answer: "Accédez à l'onglet 'Historique' dans le menu principal de l'application.",
              },
              {
                question: "Comment apprécier un chauffeur ?",
                answer:
                  "Après votre trajet, une option pour évaluer le chauffeur s'affiche sur l'écran principal.",
              },
              {
                question: "Comment annuler un trajet ?",
                answer: "Accédez à vos trajets en cours et sélectionnez 'Annuler'.",
              },
            ].map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleQuestion(item.question)}
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={expandedQuestion === item.question ? "close" : "add"}
                    size={24}
                    color="#00a84f"
                  />
                </TouchableOpacity>
                {expandedQuestion === item.question && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
            <Text style={styles.placeholderText}>Contenu des contacts à ajouter ici.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 85,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#00a84f",
  },
  tabText: {
    fontSize: 16,
    color: "#aaa",
  },
  activeTabText: {
    color: "#00a84f",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  illustration: {
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    color: "#000",
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Help;
