import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectJourneyById } from "../store/journeySlice";
import { resetDestionation, resetOrigin } from "../store/navSlice";
import { BUSSTOPS } from "../data/bus-stops";
import Map from "../components/Map/Map";
import TimetableItem from "../components/TimetableItem";
import { getDriversLocation } from "../utils/firebaseUtils";
import { useUser } from "../providers/AuthenticatedUserProvider";
import { useFocusEffect } from "@react-navigation/native";
import { fetchData } from "../utils/mapUtils";

export const MapScreen = ({ route }) => {
  const { id } = route.params;
  const selectedJourney = useSelector((state) => selectJourneyById(state, id));

  const [isScreenFocused, setIsScreenFocused] = useState(false);
  const [driverLocation, setDriverLocation] = useState();

  const dispatch = useDispatch();

  const { user } = useUser();

  const updateDriverLocation = useCallback(async () => {
    try {
      const tripID = `${selectedJourney.line}${selectedJourney.tripNumber}`;

      const driversLocationData = await getDriversLocation(tripID);
      console.log(driversLocationData);
      const uid = Object.keys(driversLocationData);
      if (uid) {
        setDriverLocation({
          latitude: driversLocationData[uid].latitude,
          longitude: driversLocationData[uid].longitude,
        });
      }
    } catch (error) {
      console.error("Błąd podczas pobierania lokalizacji kierowcy:", error);
    }
  }, [selectedJourney]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);

      updateDriverLocation();

      const updateInterval = setInterval(updateDriverLocation, 5000);

      return () => {
        clearInterval(updateInterval);
        dispatch(resetDestionation());
        dispatch(resetOrigin());
        setIsScreenFocused(false);
      };
    }, [setIsScreenFocused, updateDriverLocation])
  );

  useEffect(() => {
    if (selectedJourney) {
      const originId = selectedJourney.originStop.id;
      const destinationId = selectedJourney.destinationStop.id;
      const originStop = BUSSTOPS.find((stop) => stop.id === originId);
      const destinationStop = BUSSTOPS.find(
        (stop) => stop.id === destinationId
      );

      fetchData(dispatch, originStop, destinationStop);
    }
  }, [selectedJourney, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TimetableItem item={selectedJourney} isUserMapScreen={true} />
        {!driverLocation && (
          <View style={styles.driverInfoContainer}>
            <Text style={styles.driverLocationText}>
              Lokalizacja kierowcy jest jeszcze nieznana.
            </Text>
          </View>
        )}
      </View>
      {
        <Map
          visableMap={false}
          mapScreen={true}
          driverLocation={driverLocation}
          userUid={user.uid}
          userRole={user.role}
          isScreenFocused={isScreenFocused}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFEFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  driverInfoContainer: {
    padding: 8,
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 8,
    elevation: 3,
  },
  driverLocationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});
