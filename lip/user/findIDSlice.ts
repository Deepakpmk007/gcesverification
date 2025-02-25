import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicantState {
  id: string | null;
}

const initialState: ApplicantState = {
  id: null,
};

const applicantSlice = createSlice({
  name: "applicant",
  initialState,
  reducers: {
    setApplicantId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    clearApplicantId(state) {
      state.id = null;
    },
  },
});

export const { setApplicantId, clearApplicantId } = applicantSlice.actions;

export default applicantSlice.reducer;
