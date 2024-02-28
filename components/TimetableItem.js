import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../utils/timeUtils";
import { addPassengerTrip, removePassengerTrip } from "../utils/firebaseUtils";
import {
  addJourney,
  removeJourney,
  selectJourney,
} from "../store/journeySlice";

function TimetableItem({
  item,
  isSelectedJourneyScreen,
  isDriverHomeScreen,
  isUserMapScreen,
}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const journeys = useSelector(selectJourney);
  const isJourneySelected = journeys.some((journey) => journey.id === item.id);
  const tripID = `${item.line}${item.tripNumber}`;

  const handleTimetableItemPress = () => {
    if (isJourneySelected) {
      dispatch(removeJourney(item.id));
      removePassengerTrip(tripID, item.originStop, item.destinationStop);
    } else {
      dispatch(addJourney(item));
      addPassengerTrip(tripID, item.originStop, item.destinationStop);
    }
  };

  const handleMapPress = (id) => {
    navigation.navigate("MapScreen", { id: id });
  };

  const departureTimeString = formatTime(item.departureTime);
  const arrivalTimeString = formatTime(item.arrivalTime);

  const departureStatus = !isDriverHomeScreen
    ? item.minutesToDeparture === 0
      ? "Autobus zaraz odjeżdża."
      : item.minutesToDeparture < 0
      ? "Autobus odjechał."
      : `Czas do odjazdu: ${item.minutesToDeparture} minut`
    : item.minutesToDeparture > 0
    ? `Czas do odjazdu: ${item.minutesToDeparture} minut`
    : item.minutesToDeparture === 0
    ? "Czas wyruszać!"
    : item.minutesToDeparture < 0 && item.minutesToArrival > 0
    ? "Jesteś w trasie"
    : "Trasa zakończona";

  const isBusDeparted = isDriverHomeScreen
    ? item.minutesToArrival < 0
    : item.minutesToDeparture < 0;
  const buttonBackgroundColor = isJourneySelected ? "#FF0000" : "#53B175";

  return (
    <View
      style={[
        styles.itemContainer,
        isBusDeparted && styles.departedItemContainer,
        item.isCurrent && styles.isDrivingItemContainer,
      ]}
    >
      <View style={styles.itemTextContainer}>
        {isSelectedJourneyScreen && (
          <View style={styles.stopNamesContainer}>
            <Text
              style={[
                styles.departureStatus,
                item.isCurrent && styles.departedText,
              ]}
            >{`${item.originStop.name} - ${item.destinationStop.name}`}</Text>
          </View>
        )}
        <View style={styles.itemContainerDetalist}>
          <View style={styles.departureStatusContainer}>
            <Text
              style={[
                styles.departureStatus,
                isBusDeparted && styles.departedText,
                item.isCurrent && styles.isDrivingText,
              ]}
            >
              {departureStatus}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text>{`Linia ${item.line}`}</Text>
            <Text>{`Odjazdu: ${departureTimeString}`}</Text>
            <Text>{`Przyjazdu: ${arrivalTimeString}`}</Text>
            <Text>{`Czas przejazdu: ${
              item.transitTime !== null ? item.transitTime + " minut" : "N/A"
            }`}</Text>
          </View>
        </View>
      </View>
      {!isDriverHomeScreen && !isUserMapScreen && !isBusDeparted && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
            onPress={() => handleTimetableItemPress(item)}
          >
            <Ionicons
              name={
                isJourneySelected
                  ? "md-remove-circle-outline"
                  : "md-add-circle-outline"
              }
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
          {isSelectedJourneyScreen && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#53B175" }]}
              onPress={() => handleMapPress(item.id)}
            >
              <Ionicons name={"map"} size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
      {isDriverHomeScreen && (
        <View style={styles.passengersContainer}>
          <Ionicons
            name={"person"}
            size={30}
            color={item.isCurrent ? "#fff" : "gray"}
          />
          <Text
            style={[
              item.currentPassengers > 0 && { color: "red" },
              styles.passengersText,
            ]}
          >
            {item.currentPassengers}
          </Text>
        </View>
      )}
    </View>
  );
}

export default TimetableItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 14,
    elevation: 3,
    flex: 1,
  },
  itemContainerDetalist: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemTextContainer: { flex: 2, marginVertical: 8, marginLeft: 8 },
  departedItemContainer: {
    backgroundColor: "#ddd",
  },
  isDrivingItemContainer: {
    backgroundColor: "#53B175",
  },
  stopNamesContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  departureStatusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  departureStatus: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  departedText: {
    color: "#777",
  },
  isDrivingText: {
    color: "#265437",
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 16,
  },
  buttonContainer: {
    flex: 0.5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#53B175",
    padding: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  passengersContainer: {
    flex: 0.3,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
  },
  passengersText: {
    textAlign: "center",
    fontSize: 15,
  },
});
