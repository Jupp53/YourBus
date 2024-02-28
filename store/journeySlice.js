import { createSlice } from "@reduxjs/toolkit";
import { calculateTimeDiffInMinutes } from "../utils/timeUtils";

const initialState = {
  journeys: [],
};

export const journeysSlice = createSlice({
  name: "journeys",
  initialState,
  reducers: {
    addJourney: (state, action) => {
      state.journeys.push(action.payload);
      state.journeys.sort(
        (a, b) => a.minutesToDeparture - b.minutesToDeparture
      );
    },
    removeJourney: (state, action) => {
      state.journeys = state.journeys.filter(
        (journey) => journey.id !== action.payload
      );
    },
    updateDepartureTimeEveryMinute: (state) => {
      const currentDateTime = new Date();

      state.journeys.forEach((journey) => {
        journey.minutesToDeparture = calculateTimeDiffInMinutes(
          journey.departureTime,
          currentDateTime
        );
      });

      state.journeys.sort(
        (a, b) => a.minutesToDeparture - b.minutesToDeparture
      );
    },
    updatePassengers: (state, action) => {
      const totals = Object.fromEntries(
        Object.entries(action.payload).map(([T, SData]) => [
          T,
          Object.values(SData).reduce(
            (acc, { passengerCount }) => acc + passengerCount,
            0
          ),
        ])
      );
      state.journeys.forEach((journey) => {
        const path = `T${journey.line}${journey.tripNumber}`;
        const currentPassengers = totals[path] || 0;
        journey.currentPassengers = currentPassengers;
        if (action.payload[path]) {
          const passengersArray = Object.entries(action.payload[path]).map(
            ([key, { originId, destinationId, passengerCount }]) => ({
              origin: originId,
              destination: destinationId,
              passengerCount: passengerCount,
            })
          );

          const groupedArray = (arr, key, negate) =>
            arr.reduce((acc, { [key]: groupKey, passengerCount }) => {
              const existingGroup = acc.find((item) => item.stop === groupKey);

              if (existingGroup) {
                existingGroup.passengers += parseInt(
                  negate ? -passengerCount : passengerCount
                );
              } else {
                acc.push({
                  stop: groupKey,
                  passengers: parseInt(
                    negate ? -passengerCount : passengerCount
                  ),
                });
              }

              return acc;
            }, []);

          const originArray = groupedArray(passengersArray, "origin", false);
          const destinationArray = groupedArray(
            passengersArray,
            "destination",
            true
          );

          journey.passengers = [...originArray, ...destinationArray];
          if (journey.line === 1)
            journey.passengers.sort((a, b) => a.stop - b.stop);
          else journey.passengers.sort((a, b) => b.stop - a.stop);
        }
      });
    },
    updateDriverTime: (state) => {
      const currentDateTime = new Date();

      state.journeys.forEach((journey) => {
        journey.minutesToDeparture = calculateTimeDiffInMinutes(
          journey.departureTime,
          currentDateTime
        );

        journey.minutesToArrival = calculateTimeDiffInMinutes(
          journey.arrivalTime,
          currentDateTime
        );
      });

      state.journeys.sort((a, b) => a.minutesToArrival - b.minutesToArrival);

      const firstPositiveJourney = state.journeys.find(
        (journey) => journey.minutesToArrival > 0
      );

      state.journeys.forEach((journey) => {
        if (journey === firstPositiveJourney) journey.isCurrent = true;
        else journey.isCurrent = false;
      });
    },
    resetJourneys: () => initialState,
  },
});

export const {
  addJourney,
  removeJourney,
  updateDepartureTimeEveryMinute,
  updatePassengers,
  updateDriverTime,
  updateCurrentTrip,
  resetJourneys,
} = journeysSlice.actions;

export const selectJourney = (state) => state.journeys.journeys;

export const selectJourneyById = (state, journeyId) => {
  const specificJourney = state.journeys.journeys.find(
    (journey) => journey.id === journeyId
  );

  return specificJourney;
};

export const selectCurrentJourney = (state) => {
  return state.journeys.journeys.find((journey) => journey.isCurrent === true);
};

export default journeysSlice.reducer;
