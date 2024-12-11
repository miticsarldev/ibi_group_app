import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import React from 'react';
import Home from './Home';
import Apropos from './Apropos';
import Help from './Help';
import History from './History';
import Parametre from './Parametre';
import EditProfil from './EditProfil';
// Création du Drawer
const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Drawer Navigator */}
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: { width: '70%' },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="EditProfile" component={EditProfil} />
        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="Apropos" component={Apropos} />
        <Drawer.Screen name="Parametre" component={Parametre} />
        <Drawer.Screen name="Help" component={Help} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
// Contenu personnalisé du Drawer
function CustomDrawerContent({ navigation }) {
  return (
    <View style={styles.drawerContainer}>
      {/* Profil */}
      <View style={styles.profileContainer}>
      <Image 
          source={require('../../assets/image/user.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Yunus Sylla</Text>
        <Text style={styles.profileEmail}>yunussylla@gmail.com</Text>
      </View>

      {/* Liens */}
      <View style={styles.linksContainer}>
        <DrawerLink
          label="Modifier profil"
          onPress={() => navigation.navigate('EditProfile')}
        />
        {/* <DrawerLink
          label="Adresse"
          onPress={() => navigation.navigate('Adresse')}
        /> */}
        <DrawerLink
          label="Historique"
          onPress={() => navigation.navigate('History')}
        />
        <DrawerLink
          label="Apropos"
          onPress={() => navigation.navigate('Apropos')}
        />
        <DrawerLink
          label="Parametre"
          onPress={() => navigation.navigate('Parametre')}
        />
        <DrawerLink
          label="Help"
          onPress={() => navigation.navigate('Help')}
        />
        <DrawerLink label="Logout" onPress={() => console.log('Logged out')} />
      </View>
    </View>
  );
}

// Composant pour un lien
function DrawerLink({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress}>
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor:'#0FAC71'
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: 'gray',
  },
  linksContainer: {
    flex: 1,
  },
  link: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
});
