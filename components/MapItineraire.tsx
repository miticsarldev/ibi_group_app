import React from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export type LocationType = {
  latitude: number;
  longitude: number;
  address?: string;
};

type Map2Props = {
  userLocation: LocationType | null;
  destination: LocationType | null;
};

const Map2: React.FC<Map2Props> = ({ userLocation, destination }) => {
  const defaultRegion = {
    latitude: 12.5781975,
    longitude: -8.0036832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : defaultRegion;

  if (!userLocation)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={region}
      showsUserLocation={true}
    >
      {destination && (
        <>
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="Destination"
          />
          <MapViewDirections
            origin={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
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

export default Map2;
