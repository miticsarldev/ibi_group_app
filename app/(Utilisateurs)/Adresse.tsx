// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import React from "react";
// import { useRouter } from "expo-router";
// import { useLocationStore } from "@/store/useStore";
// import RideLayout from "@/components/RideLayout";
// import GoogleTextInput from "@/components/GoogleTextInput";
// import { icons } from "@/constants";

// const Adresse = () => {
//   const router = useRouter();

//   const {
//     userAddress,
//     destinationAddress,
//     setDestinationLocation,
//     setUserLocation,
//   } = useLocationStore();

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView style={{ flex: 1 }}>
//         <RideLayout title="Course">
//           <View className="my-3">
//             <Text className="text-lg font-JakartaSemiBold mb-3">De</Text>

//             <GoogleTextInput
//               icon={icons.target}
//               initialLocation={userAddress!}
//               //   containerStyle="#f5f5f5"
//               textInputBackgroundColor="#f5f5f5"
//               handlePress={(location) => setUserLocation(location)}
//             />
//           </View>

//           <View className="my-3">
//             <Text className="text-lg font-JakartaSemiBold mb-3">a</Text>

//             <GoogleTextInput
//               icon={icons.map}
//               initialLocation={destinationAddress!}
//               containerStyle="bg-neutral-100"
//               textInputBackgroundColor="transparent"
//               handlePress={(location) => setDestinationLocation(location)}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={() => router.push(`/(Utilisateurs)/ConfirmRide`)}
//             style={{
//               backgroundColor: "#f5f5f5",
//               borderRadius: 9999,
//               padding: 12,
//               alignItems: "center",
//               justifyContent: "center",
//               shadowColor: "#d4d4d4",
//             }}
//           >
//             <Text className={`text-lg font-bold `}>Trouver un chauffeur</Text>
//           </TouchableOpacity>
//         </RideLayout>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Adresse;

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/store/useStore";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";

const Adresse = () => {
  const router = useRouter();

  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, zIndex: 1000 }}>
        <RideLayout title="Course">
          <View style={{ marginVertical: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Jakarta-SemiBold",
                marginBottom: 12,
              }}
            >
              De
            </Text>

            <GoogleTextInput
              icon={icons.target}
              initialLocation={userAddress!}
              textInputBackgroundColor="#f5f5f5"
              handlePress={(location) => setUserLocation(location)}
            />
          </View>

          <View style={{ marginVertical: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Jakarta-SemiBold",
                marginBottom: 12,
              }}
            >
              a
            </Text>

            <GoogleTextInput
              icon={icons.map}
              initialLocation={destinationAddress!}
              textInputBackgroundColor="transparent"
              handlePress={(location) => setDestinationLocation(location)}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/(Utilisateurs)/ConfirmRide`)}
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 9999,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#d4d4d4",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Trouver un chauffeur
            </Text>
          </TouchableOpacity>
        </RideLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Adresse;
