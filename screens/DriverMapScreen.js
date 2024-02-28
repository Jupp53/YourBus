import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentJourney } from "../store/journeySlice";
import { resetDestionation, resetOrigin } from "../store/navSlice";
import { BUSSTOPS } from "../data/bus-stops";
import Map from "../components/Map/Map";
import TimetableItem from "../components/TimetableItem";
import { useUser } from "../providers/AuthenticatedUserProvider";
import { useFocusEffect } from "@react-navigation/native";
import { fetchData } from "../utils/mapUtils";

export const DriverMapScreen = () => {
  const [isScreenFocused, setIsScreenFocused] = useState(false);
  const [showStopsList, setShowStopsList] = useState(false); // Dodajemy nowy stan
  const [passengers, setPassengers] = useState([]);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);

      return () => {
        dispatch(resetDestionation());
        dispatch(resetOrigin());
        setIsScreenFocused(false);
      };
    }, [])
  );

  const { user } = useUser();
  const currentJourney = useSelector(selectCurrentJourney);

  useEffect(() => {
    if (currentJourney) {
      const originId = currentJourney.originStop;
      const destinationId = currentJourney.destinationStop;
      const originStop = BUSSTOPS.find((stop) => stop.id === originId);
      const destinationStop = BUSSTOPS.find(
        (stop) => stop.id === destinationId
      );

      fetchData(dispatch, originStop, destinationStop);
    }
  }, [currentJourney]);

  const toggleStopsList = () => {
    setShowStopsList(!showStopsList);
  };
  return (
    <View style={styles.container}>
      {currentJourney && (
        <>
          <View style={styles.header}>
            <TimetableItem item={currentJourney} isDriverHomeScreen={true} />
            <Pressable onPress={toggleStopsList}>
              <View style={styles.passengersContainer}>
                {showStopsList && (
                  <View style={styles.stopsList}>
                    <FlatList
                      data={currentJourney.passengers}
                      keyExtractor={(item) => `${item.stop}`}
                      ListEmptyComponent={() => (
                        <Text style={{ textAlign: "center" }}>
                          Brak pasażerów dla tego kursu.
                        </Text>
                      )}
                      renderItem={({ item }) => (
                        <View style={styles.detalistContainer}>
                          <View style={styles.stopsContainer}>
                            <Text>{`Przystanek nr: ${item.stop}`}</Text>
                          </View>
                          <View style={styles.passengersCount}>
                            <Text>
                              {item.passengers < 0
                                ? `Wysiada: ${Math.abs(
                                    item.passengers
                                  )} pasażer/ów`
                                : `Wsiada: ${item.passengers} pasażer/ów`}
                            </Text>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                )}
                <View style={styles.bottomContainer}>
                  <Text style={styles.showButton}>Pasażerowie</Text>
                  <Ionicons
                    name={
                      showStopsList
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={30}
                    color={"gray"}
                  />
                </View>
              </View>
            </Pressable>
          </View>
          {
            <Map
              visableMap={false}
              mapScreen={true}
              userUid={user.uid}
              userRole={user.role}
              isScreenFocused={isScreenFocused}
              tripID={`${currentJourney.line}${currentJourney.tripNumber}`}
            />
          }
        </>
      )}
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
    zIndex: 1,
  },
  passengersContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 14,
    elevation: 3,
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    flex: 1,
  },
  showButton: {
    fontSize: 15,
    fontWeight: "bold",
  },
  stopsList: {
    backgroundColor: "#FFF",
    zIndex: 2,
    flex: 1,
    width: "100%",
  },
  detalistContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  stopsContainer: {
    backgroundColor: "#53B175",
    paddingVertical: 10,
    alignItems: "flex-start",
    paddingHorizontal: 30,
    marginRight: 10,
  },
  passengerCount: { alignItems: "center" },
});
