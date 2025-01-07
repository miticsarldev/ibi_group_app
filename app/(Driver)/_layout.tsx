import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import Drawer from "expo-router/drawer";
import { COLORS } from '../../constants/styles';

const CustomDrawerContent = (props:any) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const handleLogout = () => {
    console.log("Déconnexion effectuée");
  };

  type IoniconName = "car-sport" | "document-text" | "flash" | "location-outline" | "warning" | "settings";

  type RoutePath = "/trajet" | "/historique" | "/station" | "/location" | "/signaler" | "/parametre";

const items: { name: string; route: RoutePath; icon: IoniconName }[] = [
  { name: "Trajet Disponible", route: "/trajet", icon: "car-sport" },
  { name: "Historique", route: "/historique", icon: "document-text" },
  { name: "Station", route: "/station", icon: "flash" },
  { name: "Location", route: "/location", icon: "location-outline" },
  { name: "Signaler", route: "/signaler", icon: "warning" },
  { name: "Parametre", route: "/parametre", icon: "settings" },
];

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <Image
          source={require("../../assets/image/persn.webp")}
          resizeMode='contain'
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>Admin Admin</Text>
          <Text style={styles.userEmail}>admin@gmail.com</Text>
        </View>
      </View>

      {items.map((item) => (
        <DrawerItem
          key={item.route}
          icon={({ size, color }) => <Ionicons name={item.icon} size={size} color={pathname === item.route ? "#fff" : "#000"} />}
          label={item.name}
          labelStyle={[styles.navItemLabel, { color: pathname === item.route ? "#fff" : "#000" }]}
          style={[styles.drawerItem, { backgroundColor: pathname === item.route ? "#10B981" : "#fff" }]}
          onPress={ () => {
            router.push(item.route);
          }}
        />
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Se Déconnecter</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <View style={styles.headerIcons}>
            <Ionicons name="search" size={20} color="#FFFFFF" style={styles.icon} />
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" style={styles.icon} />
          </View>
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          marginRight: 50,
          color: '#000000',
        },
      }}
    >
      <Drawer.Screen name="trajet" options={{ headerShown: true, title: 'Trajet Disponible' }} />
      <Drawer.Screen name="parametre" options={{ headerShown: true, title: 'Paramètre' }} />
      <Drawer.Screen name="historique" options={{ headerShown: true, title: 'Historique' }} />
      <Drawer.Screen name="station" options={{ headerShown: true, title: 'Station' }} />
      <Drawer.Screen name="location" options={{ headerShown: true, title: 'Location' }} />
      <Drawer.Screen name="signaler" options={{ headerShown: true, title: 'Signaler' }} />
      <Drawer.Screen name="succees" options={{ headerShown: false }} />
      <Drawer.Screen name="itineraire" options={{ headerShown: true, title: 'Itineraire' }} />
      <Drawer.Screen name="inscriptionDriver" options={{ headerShown: false }} />
      <Drawer.Screen name="editPassword" options={{ headerShown: false }} />
      <Drawer.Screen name="profil" options={{ headerShown: false }} />
      <Drawer.Screen name="stationItineraire" options={{ headerShown: true, title: 'Itineraire' }} />
      <Drawer.Screen name="demandeVoiture" options={{ headerShown: false }} />
      <Drawer.Screen name="suceessDemande" options={{ headerShown: false }} />
      <Drawer.Screen name="parrainage" options={{ headerShown: false }} />
      <Drawer.Screen name="otp" options={{ headerShown: false }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: 10,
    fontSize: 18,
  },
  drawerItemWrapper: {
    borderBottomColor: '#CACACA',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  drawerItem: {
    borderRadius: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: { 
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  userInfoWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  userImg: {
    height: 120,
    width: 143,
    borderRadius: 8,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 90,
    marginLeft: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
