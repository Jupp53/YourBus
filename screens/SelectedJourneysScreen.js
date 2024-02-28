import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectJourney,
  updateDepartureTimeEveryMinute,
} from "../store/journeySlice";
import { StyleSheet, View, FlatList } from "react-native";
import TimetableItem from "../components/TimetableItem";
import HeaderText from "../components/UI/HeaderText";
import LogoutButton from "../components/UI/LogoutButton";

export const SelectedJourneysScreen = () => {
  const dispatch = useDispatch();
  const selectedJourneys = useSelector(selectJourney);

  const updateJourneyData = useCallback(() => {
    dispatch(updateDepartureTimeEveryMinute());
  }, [dispatch]);

  useEffect(() => {
    updateJourneyData();

    const intervalId = setInterval(() => {
      dispatch(updateDepartureTimeEveryMinute());
    }, 20000);

    return () => clearInterval(intervalId);
  }, [updateJourneyData]);

  return (
    <View style={styles.container}>
      <HeaderText title="Twoje Przejazdy" color="#265437" />
      {selectedJourneys && (
        <FlatList
          data={selectedJourneys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TimetableItem item={item} isSelectedJourneyScreen={true} />
          )}
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
});
