import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import studentReducer from "./user/studentSlice";
import applicantReducer from "./user/applicantSlice";
import findIdReducer from "./user/findIDSlice";
export const store = configureStore({
  reducer: {
    studentId: studentReducer,
    applicantData: applicantReducer,
    applicantId: findIdReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["student/addFile"],
        ignoredPaths: ["student.value.files"],
      },
    }),
});
export type AppStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector;
