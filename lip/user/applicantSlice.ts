import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state type
type ApplicentState = {
  agencyName: string;
  senderEmail: string;
  contact: string;
};

// Define the initial state value
const initialStateValue: ApplicentState = {
  agencyName: "",
  senderEmail: "",
  contact: "",
};

// Create the slice
export const applicentSlice = createSlice({
  name: "applicent",
  initialState: { value: initialStateValue },
  reducers: {
    storeEmail: (state, action: PayloadAction<ApplicentState>) => {
      state.value = action.payload;
    },
  },
});

// Export the reducer and actions
export default applicentSlice.reducer;
export const { storeEmail } = applicentSlice.actions;
