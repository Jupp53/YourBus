import { get, ref, set } from "firebase/database";
import { calculateTimeDiffInMinutes } from "./timeUtils";
import { database } from "../config/firebase";
import { BUSTIMETABLES } from "../data/bus-timetables";
import { addJourney } from "../store/journeySlice";

const currentDate = new Date();
const formattedDate = `${currentDate.getDate()}-${
  currentDate.getMonth() + 1
}-${currentDate.getFullYear()}`;

const getUserName = async (userId) => {
  const roleRef = ref(database, `users/${userId}`);
  const roleSnapshot = await get(roleRef);
  return roleSnapshot.val()?.displayName || "undefined";
};

const getUserRole = async (userId) => {
  const roleRef = ref(database, `users/${userId}`);
  const roleSnapshot = await get(roleRef);
  return roleSnapshot.val()?.role || "user";
};

const saveUserLocation = (userId, location) => {
  const userLocationRef = ref(database, `userLocations/${userId}`);

  set(userLocationRef, {
    latitude: location.latitude,
    longitude: location.longitude,
  });
};

const getPassengersCount = async () => {
  const passengersRef = ref(database, `trips/${formattedDate}`);
  const passengersSnapshot = await get(passengersRef);
  return passengersSnapshot.val() || "undefined";
};

const getCurrentPassengerCount = async (path) => {
  const tripRef = ref(database, path);
  const snapshot = await get(tripRef);
  return snapshot.val()?.passengerCount || 0;
};

const updatePassengerCount = async (
  tripID,
  originID,
  destinationID,
  increment
) => {
  const path = `trips/${formattedDate}/T${tripID}/S${originID.id}${destinationID.id}`;
  const tripRef = ref(database, path);
  const currentPassengerCount = await getCurrentPassengerCount(path);

  set(tripRef, {
    originId: originID.id,
    destinationId: destinationID.id,
    passengerCount: currentPassengerCount + increment,
  });
};

const addPassengerTrip = async (tripID, originID, destinationID) => {
  await updatePassengerCount(tripID, originID, destinationID, 1);
};

const removePassengerTrip = async (tripID, originID, destinationID) => {
  await updatePassengerCount(tripID, originID, destinationID, -1);
};

const saveDriverLocation = (driverId, location, tripID) => {
  const driverLocationRef = ref(database, `driverLocations/${driverId}`);

  set(driverLocationRef, {
    latitude: location.latitude,
    longitude: location.longitude,
    tripID,
  });
};

const getDriversLocation = async () => {
  const driverLocationRef = ref(database, "driverLocations");
  const roleSnapshot = await get(driverLocationRef);
  return roleSnapshot.val() || "undefined";
};

const getDriverTripNumbers = async (userId) => {
  const roleRef = ref(database, `users/${userId}`);
  const roleSnapshot = await get(roleRef);
  return roleSnapshot.val()?.tripNumbers || "undefined";
};

const fetchDriverTripNumbers = async (user, dispatch) => {
  try {
    const numbers = await getDriverTripNumbers(user.uid);
    const currentDate = new Date();
    const passengers = await getPassengersCount();

    const totals = Object.fromEntries(
      Object.entries(passengers).map(([T, SData]) => [
        T,
        Object.values(SData).reduce(
          (acc, { passengerCount }) => acc + passengerCount,
          0
        ),
      ])
    );

    numbers.forEach(async (number) => {
      const busLine = Math.floor(number / 10);
      const tripNumber = number % 10;

      const schedulesForLine = BUSTIMETABLES.filter(
        (item) => item.line === busLine
      );

      const departureTime = schedulesForLine[0].schedule[tripNumber];
      const arrivalTime =
        schedulesForLine[schedulesForLine.length - 1].schedule[tripNumber];
      const originStop = schedulesForLine[0].stop;
      const destinationStop =
        schedulesForLine[schedulesForLine.length - 1].stop;
      const currentPassengers = totals[`T${busLine}${tripNumber}`] || 0;
      const updatedTripObject = {
        id: parseInt(`${busLine}${originStop}${destinationStop}${tripNumber}`),
        line: busLine,
        tripNumber,
        departureTime: departureTime.toISOString(),
        originStop,
        arrivalTime: arrivalTime.toISOString(),
        destinationStop,
        minutesToDeparture: calculateTimeDiffInMinutes(
          departureTime,
          currentDate
        ),
        minutesToArrival: calculateTimeDiffInMinutes(arrivalTime, currentDate),
        transitTime: calculateTimeDiffInMinutes(arrivalTime, departureTime),
        isCurrent: false,
        currentPassengers: currentPassengers,
        passengers: passengers[`T${busLine}${tripNumber}`],
      };

      dispatch(addJourney(updatedTripObject));
    });
  } catch (error) {
    console.error("Error fetching driver trip numbers:", error);
    throw error;
  }
};

export {
  getUserRole,
  getUserName,
  saveUserLocation,
  saveDriverLocation,
  getDriversLocation,
  getDriverTripNumbers,
  fetchDriverTripNumbers,
  getPassengersCount,
  getCurrentPassengerCount,
  addPassengerTrip,
  removePassengerTrip,
};
