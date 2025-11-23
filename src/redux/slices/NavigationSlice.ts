import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// define initial state type
interface NavigationState {
  currentPage: string;
}

// Initial State
const initialState: NavigationState = {
  currentPage: "Home",
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = navigationSlice.actions;
export default navigationSlice.reducer;
