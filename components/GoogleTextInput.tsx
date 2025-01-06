import { View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 50,
          borderRadius: 20,
          marginBottom: 20,
          marginHorizontal: 0,
          shadowColor: "#d4d4d4",
        },
      ]}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "fr",
        }}
        renderLeftButton={() => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
            }}
          >
            <Image
              source={icon ? icon : icons.search}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Où allons-nous aller?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
