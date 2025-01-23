import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import Drawer from "expo-router/drawer";
import { COLORS } from '@/constants/styles'; 
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
import { Deconnexion, getUserInfo } from '@/services/authService';

const CustomDrawerContent = (props:any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [personne, setUser] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Confirmation',
        'Voulez-vous vraiment vous déconnecter ?',
        [
          {
            text: 'Non',
            style: 'cancel',
          },
          {
            text: 'Oui',
            onPress: async () => {
              try {
                await Deconnexion(dispatch);
                showToast('Déconnexion réussie.', 'success');
                router.replace('/(UserLogin)/Connexion');
              } catch (error) {
                console.error('Erreur lors de la déconnexion :', error);
                showToast('Une erreur est survenue lors de la déconnexion.', 'error');
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      showToast('Une erreur est survenue lors de la déconnexion.', 'error');
    }
  };

  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

    // Récupérer les informations de l'utilisateur
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const userInfo = await getUserInfo(); // Appeler le service pour récupérer les données.
          setUser(userInfo);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
        }
      };
      fetchUserInfo();
    }, []); 

  type IoniconName = "car-sport" | "document-text" | "flash" | "location-outline" | "warning" | "settings";

  type RoutePath = "/trajet" | "/historique" | "/station" | "/location" | "/signaler" | "/parametre";

const allItems: { name: string; route: RoutePath; icon: IoniconName; roles: string[] }[] = [
  { name: "Trajet Disponible", route: "/trajet", icon: "car-sport", roles: ["Chauffeur Personnel"]  },
  { name: "Location", route: "/location", icon: "location-outline", roles: ["Chauffeur IBI"] },
  { name: "Station", route: "/station", icon: "flash", roles: ["Chauffeur IBI"] },
  { name: "Signaler", route: "/signaler", icon: "warning", roles: ["Chauffeur IBI"] },
  { name: "Historique", route: "/historique", icon: "document-text", roles: ["Chauffeur Personnel", "Chauffeur IBI"] },
  { name: "Parametre", route: "/parametre", icon: "settings", roles: ["Chauffeur Personnel", "Chauffeur IBI"] },
];

const items = allItems.filter((item) => user.role && item.roles.includes(user.role));


  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
      {personne ? (
        <>
        <Image
          source={require("../../assets/image/persn.webp")}
          resizeMode='contain'
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{personne.fullName || "Utilisateur"}</Text>
          <Text style={styles.userEmail}>{personne.email}</Text>
        </View>
        </>
      ) : (
        <Text style={styles.userName}>Chargement...</Text>
      )}
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
