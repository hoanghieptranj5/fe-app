import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRandomHanzi } from '../../services/HanziService';

// Define the types for the response from the API
interface GetRandomHanziResponse {
  hanzi: string[]; // Array of Hanzi characters
}

// Define the state structure
interface HanziCardState {
  isLoading: boolean;
  items: string[]; // Array of Hanzi characters
  errorMessage: string;
}

// Define the initial state with the correct types
const initialState: HanziCardState = {
  isLoading: true,
  items: [],
  errorMessage: '',
};

// Define the payload type for the async thunk
interface GetRandomHanziPayload {
  length: number;
  token: string;
}

// Create an async thunk to fetch the data
export const getRandomHanziList = createAsyncThunk<GetRandomHanziResponse, GetRandomHanziPayload>(
  'v2/getRandomHanzi',
  async (payload) => {
    const response = await getRandomHanzi(payload.length, payload.token);
    return response; // Returns the GetRandomHanziResponse directly
  }
);

// Create the slice with the correct types for state and actions
export const hanziCardSlice = createSlice({
  name: 'hanziCard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRandomHanziList.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getRandomHanziList.fulfilled, (state, action: PayloadAction<GetRandomHanziResponse>) => {
      state.isLoading = false;
      state.items = action.payload.hanzi; // Use the 'hanzi' field from the response
      console.log(state.items);
    });

    builder.addCase(getRandomHanziList.rejected, (state) => {
      state.isLoading = false;
      state.errorMessage = 'Error while loading';
    });
  },
});

export default hanziCardSlice.reducer;
