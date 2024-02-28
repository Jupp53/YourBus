import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { GOOGLE_MAPS_APIKEY } from "@env";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import useLocation from "./Location";
import IconButton from "../UI/IconButton";
import MapMarker from "./MapMarker";

import { useSelector } from "react-redux";
import { selectDestination, selectOrigin } from "../../store/navSlice";

import {
  saveUserLocation,
  saveDriverLocation,
} from "../../utils/firebaseUtils";

function Map({
  visableMap,
  mapScreen,
  userUid,
  userRole,
  isScreenFocused,
  tripID,
  driverLocation,
}) {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
    isClicked: false,
  });

  const getUserLocation = useLocation();

  const mapRef = useRef();

  const fitMapToPolyline = async () => {
    const locationsToFit = [origin?.location, destination?.location].filter(
      Boolean
    );
    if (driverLocation) {
      locationsToFit.push(driverLocation);
    }

    await mapRef.current.fitToCoordinates(locationsToFit, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: false,
    });
  };

  useEffect(() => {
    if (isScreenFocused && tripID) {
      console.log("Start");
      startLocationUpdate();
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Stop");
        setIntervalId(null);
      }
    }
  }, [isScreenFocused]);

  useEffect(() => {
    if (origin || destination) {
      const getLocationData = (location) => ({
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      if (origin && !destination) {
        setSelectedLocation(getLocationData(origin.location));
      } else if (!origin && destination) {
        setSelectedLocation(getLocationData(destination.location));
      } else if (origin && destination && !mapScreen) {
        const calculateMidpoint = (loc1, loc2) => ({
          latitude: (loc1.latitude + loc2.latitude) / 2,
          longitude: (loc1.longitude + loc2.longitude) / 2,
          latitudeDelta: Math.abs(loc2.latitude - loc1.latitude) + 0.1,
          longitudeDelta: Math.abs(loc1.longitude - loc1.longitude) + 0.1,
        });

        setSelectedLocation({
          ...calculateMidpoint(origin.location, destination.location),
        });
      } else {
        return;
      }
    }
  }, [origin, destination]);

  const handleGetLocation = async () => {
    const location = await getUserLocation();
    if (userRole === "user") {
      saveUserLocation(userUid, location);
    } else {
      saveDriverLocation(userUid, location, tripID);
    }
    if (location) {
      setUserLocation({
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        isClicked: true,
      });
    }
  };

  const handleUserLocationCenter = () => {
    setUserLocation((prevState) => ({
      ...prevState,
      isClicked: true,
    }));
    setSelectedLocation({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleDriverLocationCenter = () => {
    setSelectedLocation({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const startLocationUpdate = async () => {
    await handleGetLocation();

    const id = setInterval(async () => {
      await handleGetLocation();
    }, 5000);

    setIntervalId(id);
  };

  const toggleLocationUpdate = async () => {
    if (!intervalId) {
      await startLocationUpdate();
      console.log("Start");
    } else handleUserLocationCenter();
  };

  return (
    <View style={[styles.container, { opacity: visableMap ? 0 : 1 }]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        initialRegion={{
          latitude: 49.777657922840774,
          longitude: 19.81284542505907,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={selectedLocation}
        onTouchEnd={(event) => {
          setUserLocation((prevState) => ({
            ...prevState,
            isClicked: false,
          }));
          setSelectedLocation({
            latitude: event.latitude,
            longitude: event.longitude,
            latitudeDelta: event.latitudeDelta,
            longitudeDelta: event.longitudeDelta,
          });
        }}
        onMapReady={() => {
          if (mapScreen) fitMapToPolyline();
        }}
      >
        {userLocation && (
          <MapMarker
            lat={userLocation.latitude}
            lng={userLocation.longitude}
            icon={"Location"}
          />
        )}
        {origin && (
          <MapMarker
            identifier={"Origin"}
            lat={origin.location.latitude}
            lng={origin.location.longitude}
            name={origin.details.name}
            icon={"Origin"}
          />
        )}
        {destination && (
          <MapMarker
            identifier={"Destination"}
            lat={destination.location.latitude}
            lng={destination.location.longitude}
            name={destination.details.name}
            icon={"Destination"}
          />
        )}
        {driverLocation && (
          <MapMarker
            identifier={"DriverLocation"}
            lat={driverLocation.latitude}
            lng={driverLocation.longitude}
            name={"Kierowca"}
            icon={"busDriver"}
          />
        )}
        {origin !== null && destination !== null && (
          <MapViewDirections
            origin={origin.location}
            destination={destination.location}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="red"
          />
        )}
      </MapView>
      {userRole === "user" && (
        <View
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            bottom: 40,
            right: 20,
          }}
        >
          <IconButton
            icon={userLocation.isClicked ? "location-outline" : "location"}
            size={40}
            color={"red"}
            onPress={toggleLocationUpdate}
            displayStatus={visableMap}
          ></IconButton>
        </View>
      )}
      {driverLocation && (
        <View
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            bottom: 100,
            right: 20,
          }}
        >
          <IconButton
            icon={userLocation.isClicked ? "bus-outline" : "bus"}
            size={40}
            color={"black"}
            onPress={handleDriverLocationCenter}
            displayStatus={visableMap}
          ></IconButton>
        </View>
      )}
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
});
