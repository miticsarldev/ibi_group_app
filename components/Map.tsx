import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { useDriverStore, useLocationStore } from "@/store/useStore";
import { Driver, MarkerData } from "@/types";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { icons } from "@/constants";
// import { useFetch } from "@/lib/fetch";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const drivers: Driver[] = [
  {
    id: 1,
    name: "Lamine Traoré",
    image:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    email: "lamine.traore@example.com",
    phone: "+22370012345",
    address: "Garantibougou, près de la mosquée, Bamako, Mali",
    isActive: true,
    licenseNumber: "B001234567",
    status: "Active",
    experienceYears: 5,
    rating: 4.8,
    joinedDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Ousmane Sylla",
    image:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    email: "ousmane.sylla@example.com",
    phone: "+22370012346",
    address: "Kalaban Coura, Bamako, Mali",
    isActive: true,
    licenseNumber: "B001234568",
    status: "Active",
    experienceYears: 6,
    rating: 4.6,
    joinedDate: "2019-08-20",
  },
  {
    id: 3,
    name: "Chaka Coulibaly",
    image:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    email: "chaka.coulibaly@example.com",
    phone: "+22370012347",
    address: "Sogoniko, Bamako, Mali",
    isActive: false,
    licenseNumber: "B001234569",
    status: "Inactive",
    experienceYears: 4,
    rating: 4.7,
    joinedDate: "2021-01-10",
  },
  {
    id: 4,
    name: "Robert Green",
    image:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    email: "robert.green@example.com",
    phone: "+22370012348",
    address: "Sabalibougou, Bamako, Mali",
    isActive: true,
    licenseNumber: "B001234570",
    status: "Active",
    experienceYears: 7,
    rating: 4.9,
    joinedDate: "2018-11-05",
  },
];

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  //   const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const defaultRegion = {
    latitude: 12.5781975,
    longitude: -8.0036832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const region =
    calculateRegion({
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude,
    }) || defaultRegion;

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers]);

  if (!userLatitude && !userLongitude)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  //   if (error)
  //     return (
  //       <View
  //         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  //         // className="flex justify-between items-center w-full"
  //       >
  //         <Text>Error: {error}</Text>
  //       </View>
  //     );

  //   console.log("region", region);
  //   console.log("markers", markers);
  //   console.log("API", directionsAPI);

  //   return (
  //     <View>
  //       <Text>Map</Text>
  //     </View>
  //   );

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1, borderRadius: 20, zIndex: 10000 }}
      tintColor="black"
      mapType="standard"
      showsPointsOfInterest={true}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      showsCompass={true}
      showsBuildings={true}
      showsTraffic={true}
      showsMyLocationButton={true}
      showsIndoors={true}
      showsIndoorLevelPicker={true}
      showsScale={true}
      shouldRasterizeIOS={true}
    >
      {markers?.map((marker, index) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === +marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
