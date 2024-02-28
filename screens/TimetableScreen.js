import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { selectDestination, selectOrigin } from "../store/navSlice";
import { BUSTIMETABLES } from "../data/bus-timetables";
import { calculateTimeDiffInMinutes } from "../utils/timeUtils";
import TimetableItem from "../components/TimetableItem";

export const TimetableScreen = () => {
  const [departureData, setDepartureData] = useState([]);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const currentDate = new Date();
  const line = origin.details.id < destination.details.id ? 1 : 2;

  const primaryDepartureData = BUSTIMETABLES.filter(
    (timetable) =>
      timetable.line === line && timetable.stop === origin.details.id
  ).flatMap((timetable) =>
    timetable.schedule
      .filter((scheduleTime) => scheduleTime > currentDate)
      .map((scheduleTime) => {
        return {
          id: parseInt(
            `${timetable.line}${origin.details.id}${
              destination.details.id
            }${timetable.schedule.indexOf(scheduleTime)}`
          ),
          line: timetable.line,
          tripNumber: timetable.schedule.indexOf(scheduleTime),
          departureTime: scheduleTime.toISOString(),
          originStop: origin.details,
          destinationStop: destination.details,
          minutesToDeparture: calculateTimeDiffInMinutes(
            scheduleTime,
            currentDate
          ),
          arrivalTime: null,
          transitTime: 0,
        };
      })
  );

  primaryDepartureData.forEach((departure) => {
    const matchingDeparture = BUSTIMETABLES.find(
      (timetable) =>
        timetable.line === departure.line &&
        timetable.stop === destination.details.id &&
        timetable.schedule.length > departure.tripNumber
    );

    if (matchingDeparture) {
      departure.arrivalTime =
        matchingDeparture.schedule[departure.tripNumber].toISOString();
      departure.transitTime = calculateTimeDiffInMinutes(
        departure.arrivalTime,
        departure.departureTime
      );
    }
  });

  const updateDepartureData = () => {
    setDepartureData((prevDepartureData) =>
      prevDepartureData.map((time) => ({
        ...time,
        minutesToDeparture: calculateTimeDiffInMinutes(
          time.departureTime,
          new Date()
        ),
      }))
    );
  };

  useEffect(() => {
    setDepartureData(primaryDepartureData);
    updateDepartureData();
    const intervalId = setInterval(updateDepartureData, 20000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.busstops}
      >{`${origin.details.name} - ${destination.details.name}`}</Text>
      <FlatList
        data={departureData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TimetableItem item={item} isSelectedJourneyScreen={false} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  busstops: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
