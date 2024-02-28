import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestionation: (state, action) => {
      state.destination = action.payload;
    },
    resetOrigin: (state) => {
      state.origin = initialState.origin;
    },
    resetDestionation: (state) => {
      state.destination = initialState.destination;
    },
  },
});

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;

export default navSlice.reducer;

export const {
  setOrigin,
  setDestionation,
  setTravelTimeInformation,
  resetOrigin,
  resetDestionation,
} = navSlice.actions;
