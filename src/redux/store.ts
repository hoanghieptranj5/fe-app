import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./slices/NavigationSlice";
import peopleExpensesReducer from "./slices/peopleExpensesSlice";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    peopleExpenses: peopleExpensesReducer,
  },
});

export default store;

// Define the RootState and AppDispatch for use in components and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
