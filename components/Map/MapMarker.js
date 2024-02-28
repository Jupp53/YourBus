import { Image, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

function MapMarker({ lat, lng, name, icon }) {
  const customAnchor =
    icon === "Location" ? { x: 0.5, y: 0.6 } : { x: 0.58, y: 0.95 };

  return (
    <Marker
      title={name}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      anchor={customAnchor}
    >
      {icon === "Location" && (
        <Image
          source={require("../../assets/Location.png")}
          style={[styles.markerImage]}
        />
      )}
      {icon === "Origin" && (
        <Image
          source={require("../../assets/Origin.png")}
          style={styles.markerImage}
        />
      )}
      {icon === "Destination" && (
        <Image
          source={require("../../assets/Destination.png")}
          style={styles.markerImage}
        />
      )}
      {icon === "busDriver" && (
        <Image
          source={require("../../assets/busDriver.png")}
          style={styles.markerImage}
        />
      )}
    </Marker>
  );
}

export default MapMarker;

const styles = StyleSheet.create({
  markerImage: {
    width: 35,
    height: 35,
  },
});
