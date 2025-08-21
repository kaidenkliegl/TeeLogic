import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: { selectedDate: new Date() },
  reducers: {
    setDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    nextDay: (state) => {
      const date = new Date(state.selectedDate);
      date.setDate(date.getDate() + 1);
      state.selectedDate = date;
    },
    prevDay: (state) => {
      const date = new Date(state.selectedDate);
      date.setDate(date.getDate() - 1);
      state.selectedDate = date;
    },
  },
});

export const { setDate, nextDay, prevDay } = dateSlice.actions;
export default dateSlice.reducer;
