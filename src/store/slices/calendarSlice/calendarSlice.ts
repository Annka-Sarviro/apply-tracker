import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarState, CalendarTab } from "./calendarTypes.ts";
import { resetStore } from "@/store/resetStore.ts";

const initialState: CalendarState = {
  selectedDate: new Date(),
  selectedMonth: new Date(),
  selectedYear: new Date().getFullYear(),
  activeTab: "day",
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
    setSelectedMonth: (state, action: PayloadAction<Date>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<CalendarTab>) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const {
  setSelectedDate,
  setSelectedMonth,
  setSelectedYear,
  setActiveTab,
} = calendarSlice.actions;

export default calendarSlice.reducer;
