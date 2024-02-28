import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { formatTime } from "../../utils/timeUtils";
import { BUSSTOPS } from "../../data/bus-stops";

export const StopTimeTable = ({ route }) => {
  const { timetable } = route.params;

  const schedule = timetable[0].schedule.map((dateString) =>
    formatTime(new Date(dateString))
  );

  const busStopName = `Przystanek nr ${timetable[0].stop}: ${
    BUSSTOPS[timetable[0].stop].name
  }`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{busStopName}</Text>
      <View style={styles.timetableContainer}>
        {schedule.map((hour, index) => (
          <Text key={index} style={styles.scheduleItem}>
            {hour}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFEFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timetableContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  scheduleItem: {
    fontSize: 30,
    marginVertical: 5,
    color: "#333",
  },
});
