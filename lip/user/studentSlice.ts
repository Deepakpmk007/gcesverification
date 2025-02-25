import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Student = {
  uniqueId: string;
  name: string;
  dateOfBirth: string;
  regNo: number;
  degree: string;
  branch: string;
  nameOfTheInstitution: string;
  university: string;
  yearOfPassing: string;
  yearOfStudy: string;
  CGPA: number;
  backlogs: string;
  classObtain: string;
  remark: string;
  file: string[];
  fileIds: string[];
};

// Define the initial state
const initialState: { value: Student } = {
  value: {
    uniqueId: "",
    name: "",
    dateOfBirth: "",
    regNo: 0,
    degree: "",
    branch: "",
    nameOfTheInstitution: "",
    university: "",
    yearOfPassing: "",
    yearOfStudy: "",
    CGPA: 0,
    backlogs: "",
    classObtain: "",
    remark: "",
    file: [],
    fileIds: [], // Initialize as an empty array
  },
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    // Store the full student data
    storeId: (state, action: PayloadAction<Student>) => {
      state.value = action.payload;
    },
  },
});

// Export the actions and the reducer
export const { storeId } = studentSlice.actions;
export default studentSlice.reducer;
