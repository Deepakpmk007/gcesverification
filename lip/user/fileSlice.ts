import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FileType = File;

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
  initialState,
  reducers: {
    fileStore: (state, action: PayloadAction<FileType[]>) => {
      state.value.file = action.payload;
    },
  },
});

export default fileSlice.reducer;

export const { fileStore } = fileSlice.actions;
