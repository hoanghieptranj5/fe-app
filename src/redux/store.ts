import {configureStore} from "@reduxjs/toolkit";
import navigationReducer from "./slices/NavigationSlice";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  }
});

export default store;

// Define the RootState and AppDispatch for use in components and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
