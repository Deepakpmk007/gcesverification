import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ApplicentState = {
  agencyName: string;
  senderEmail: string;
  contact: string;
};

const initialStateValue: ApplicentState = {
  agencyName: "",
  senderEmail: "",
  contact: "",
};

export const applicentSlice = createSlice({
  name: "applicent",
  initialState: { value: initialStateValue },
  reducers: {
    storeEmail: (state, action: PayloadAction<ApplicentState>) => {
      state.value = action.payload;
    },
  },
});

export default applicentSlice.reducer;
export const { storeEmail } = applicentSlice.actions;
