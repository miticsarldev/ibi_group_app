import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from "../../constants/styles"; 
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router } from 'expo-router';

// Typage des trajets
interface Trajet {
  id: number;
  type: string;
  localisation: string;
  personnes: number;
  temps: string;
  distance: string;
  prix: string;
  image: any;
}

// Typage de navigation
type RootStackParamList = {
  TrajetDisponible: undefined;
};

type NavigationProp = DrawerNavigationProp<RootStackParamList, 'TrajetDisponible'>;

interface TrajetDisponibleProps {
  navigation: NavigationProp;
}

const TrajetDisponible: React.FC<TrajetDisponibleProps> = ({ navigation }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    console.log("Sidebar toggled:", isSidebarOpen);
  };

  const handleNext = () => {
    router.navigate('/(Driver)/itineraire'); 
  }
  const trajets: Trajet[] = [
    {
      id: 1,
      type: 'Super Car',
      localisation: 'Lafiabougou',
      personnes: 2,
      temps: 'il y a 3 mins',
      distance: '800m (à 5 mins)',
      prix: '500 CFA',
      image: require('../../assets/image/voiture.png'),
    },
    {
      id: 2,
      type: 'Car Eco',
      localisation: 'Kati',
      personnes: 1,
      temps: 'il y a 23 mins',
      distance: '900m (à 5 mins)',
      prix: '1000 CFA',
      image: require('../../assets/image/personnel.png'),
    },
  ];

  const renderTrajet = ({ item }: { item: Trajet }) => (

    <View style={styles.card}>
      {/* Titre et info principale */}
      <View style={styles.cardHeader}>
        <Text style={styles.carType}>{item.type}</Text>
        <Text style={styles.infoText}>{item.personnes} prs | {item.temps}</Text>
      </View>

      {/* Contenu principal avec détails et image */}
      <View style={styles.cardContent}>
        <View style={styles.carDetails}>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#00A76E" />
            <Text style={styles.infoText}>{item.localisation}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="walk-outline" size={16} color="#00A76E" />
            <Text style={styles.infoText}>{item.distance}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="cash-outline" size={16} color="#00A76E" />
            <Text style={styles.infoText}>{item.prix}</Text>
          </View>
        </View>
        <Image source={item.image} style={styles.carImage} />
      </View>

      {/* Boutons d'action */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.refuserButton}>
          <Text style={styles.buttonText}>Refuser</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.accepterButton}>
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}> 

      <FlatList
        data={trajets}
        renderItem={renderTrajet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  list: {
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  carType: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoText: {
    fontSize: SIZES.font - 2,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  carDetails: {
    flex: 1,
  },
  carImage: {
    width: 100,
    height: 60,
    borderRadius: SIZES.radius,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refuserButton: {
    flex: 1,
    backgroundColor: COLORS.darkGray,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
    alignItems: 'center',
  },
  accepterButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginLeft: SIZES.base,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font - 2,
    fontWeight: 'bold',
  },
});

export default TrajetDisponible;
