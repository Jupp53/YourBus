import { configureStore } from "@reduxjs/toolkit";

import navReducer from "./navSlice";
import journeyReducer from "./journeySlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    journeys: journeyReducer,
  },
});
