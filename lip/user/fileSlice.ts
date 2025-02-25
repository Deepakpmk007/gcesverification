import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the file
type FileType = File;

// Define the initial state type
interface FileState {
  value: {
    file: FileType[];
  };
}

const initialState: FileState = {
  value: {
    file: [],
  },
};

export const fileSlice = createSlice({
  name: "file",
  initialState, // Use the initialState defined above
  reducers: {
    // Typing the action payload with the correct type
    fileStore: (state, action: PayloadAction<FileType[]>) => {
      state.value.file = action.payload; // Update the file array
    },
  },
});

export default fileSlice.reducer;

// Export the action for dispatching
export const { fileStore } = fileSlice.actions;
