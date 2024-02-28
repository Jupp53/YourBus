import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BUSSTOPS } from "../../data/bus-stops";
import { BUSTIMETABLES } from "../../data/bus-timetables";

export const BusStopsScreen = ({ route }) => {
  const navigation = useNavigation();

  const { lineId } = route.params;

  const lineStops = BUSTIMETABLES.filter((stop) => stop.line === lineId).map(
    (stop) => stop.stop
  );

  const stopsToShow = lineStops
    .map((stopId) => BUSSTOPS.find((stop) => stop.id === stopId))
    .filter((stop) => stop !== undefined);

  const handleStopPress = (stop) => {
    const timetable = BUSTIMETABLES.filter(
      (table) => table.line === lineId && table.stop == stop.id
    );

    const serializableSchedule = timetable[0].schedule.map((date) =>
      date.toISOString()
    );

    navigation.navigate("StopTimeTable", {
      timetable: [
        {
          line: lineId,
          schedule: serializableSchedule,
          stop: stop.id,
        },
      ],
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.stopItem}
      onPress={() => handleStopPress(item)}
    >
      <View style={styles.stopContainer}>
        <View style={styles.circle} />
        <Text style={styles.stopText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <FlatList
        data={stopsToShow}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFEFA",
  },
  stopItem: {
    borderBottomWidth: 1,
    borderBottomStartRadius: 11,
    borderBottomColor: "#ccc",
  },
  stopContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    zIndex: 2,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
    marginRight: 12,
  },
  stopText: {
    fontSize: 18,
    color: "#333",
  },
  line: {
    width: 2, // szerokość linii
    height: "100%", // długość linii
    left: 21,
    backgroundColor: "black", // kolor linii
    position: "absolute",
    zIndex: 1,
  },
});
