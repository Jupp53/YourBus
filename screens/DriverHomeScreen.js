import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  resetJourneys,
  selectJourney,
  updateDriverTime,
  updatePassengers,
} from "../store/journeySlice";
import TimetableItem from "../components/TimetableItem";
import HeaderText from "../components/UI/HeaderText";
import LogoutButton from "../components/UI/LogoutButton";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";

import { useUser } from "../providers/AuthenticatedUserProvider";
import {
  fetchDriverTripNumbers,
  getPassengersCount,
} from "../utils/firebaseUtils";

export const DriverHomeScreen = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const titleName = `Witaj ${user.displayName}, kierowco!`;

  const [isLoading, setIsLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);

      await fetchDriverTripNumbers(user, dispatch);
      await updateJourneyData();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching driver trip numbers:", error);
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(resetJourneys());
    fetchTrips();
  }, [user.uid, fetchTrips]);

  const selectedJourneys = useSelector(selectJourney);

  const updateJourneyData = useCallback(async () => {
    const passengers = await getPassengersCount();
    dispatch(updatePassengers(passengers));
    dispatch(updateDriverTime());
  }, [dispatch]);

  useEffect(() => {
    updateJourneyData();

    const intervalId = setInterval(() => {
      updateJourneyData();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [updateJourneyData]);

  const flatListRef = useRef(null);
  const currentJourneyIndex = selectedJourneys.findIndex(
    (item) => item.isCurrent
  );
  const scrollToCurrentJourney = () => {
    if (currentJourneyIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentJourneyIndex });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    scrollToCurrentJourney();
    setIsLoading(false);
  }, [currentJourneyIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderText title={titleName} style={{ padding: 10 }} color="#53B175" />
      </View>
      {isLoading && <LoadingOverlay />}
      {selectedJourneys && (
        <FlatList
          ref={flatListRef}
          data={selectedJourneys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TimetableItem item={item} isDriverHomeScreen={true} />
          )}
          getItemLayout={(data, index) => ({
            length: 108,
            offset: 108 * index,
            index,
          })}
        />
      )}
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  header: {},
  signOutButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    paddingRight: 5,
  },
});
