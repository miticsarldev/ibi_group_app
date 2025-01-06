// import BottomSheet, {
//   BottomSheetScrollView,
//   BottomSheetView,
// } from "@gorhom/bottom-sheet";
// import { useRouter } from "expo-router";
// import React, { useRef } from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// import Map from "@/components/Map";
// import { icons } from "@/constants";

// const RideLayout = ({
//   title,
//   snapPoints,
//   children,
// }: {
//   title: string;
//   snapPoints?: string[];
//   children: React.ReactNode;
// }) => {
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const router = useRouter();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={{ flex: 1, backgroundColor: "#fff" }}>
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "column",
//             height: "100%",
//             backgroundColor: "#52D5BA",
//           }}
//         >
//           <View
//             style={{
//               position: "absolute",
//               top: 16,
//               left: 16,
//               zIndex: 9999,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "flex-start",
//               padding: 20,
//             }}
//             // className="flex flex-row absolute z-10 top-16 items-center justify-start px-5"
//           >
//             <TouchableOpacity onPress={() => router.back()}>
//               <View
//                 style={{
//                   padding: 12,
//                   borderRadius: 9999,
//                   backgroundColor: "#fff",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: 40,
//                   width: 40,
//                 }}
//               >
//                 <Image
//                   source={icons.backArrow}
//                   resizeMode="contain"
//                   className="w-6 h-6"
//                 />
//               </View>
//             </TouchableOpacity>
//             <Text className="text-xl font-JakartaSemiBold ml-5">
//               {title || "Go Back"}
//             </Text>
//           </View>

//           <Map />
//         </View>

//         <BottomSheet
//           ref={bottomSheetRef}
//           snapPoints={snapPoints || ["40%", "85%"]}
//           index={0}
//         >
//           {title === "Choose a Rider" ? (
//             <BottomSheetView
//               style={{
//                 flex: 1,
//                 padding: 20,
//               }}
//             >
//               {children}
//             </BottomSheetView>
//           ) : (
//             <BottomSheetScrollView
//               style={{
//                 flex: 1,
//                 padding: 20,
//               }}
//             >
//               {children}
//             </BottomSheetScrollView>
//           )}
//         </BottomSheet>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default RideLayout;

import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { icons } from "@/constants";

const RideLayout = ({
  title,
  snapPoints,
  children,
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  const handleBack = () => {
    console.log("router");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(Utilisateurs)/(tabs)/home");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#52D5BA",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 9999,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity onPress={handleBack}>
              <View
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  width: 40,
                }}
              >
                <Image
                  source={icons.backArrow}
                  resizeMode="contain"
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Jakarta-SemiBold",
                marginLeft: 20,
              }}
            >
              {title || "Go Back"}
            </Text>
          </View>

          <Map />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
        >
          {title === "Choose a Rider" ? (
            <BottomSheetView
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              {children}
            </BottomSheetView>
          ) : (
            <BottomSheetScrollView
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              {children}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
