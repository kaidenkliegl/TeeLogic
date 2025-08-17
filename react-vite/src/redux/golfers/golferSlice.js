import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGolfers,
  fetchGolfer,
  addGolfer,
  deleteGolfer,
  updateGolfer,
} from "./golferThunk";

const initialState = {
  golfers: [],
  selected: null, 
  status: "idle",
  error: null,
};

const golfersSlice = createSlice({
  name: "golfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchGolfers.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchGolfers.fulfilled, (state, action) => { state.status = "succeeded"; state.golfers = action.payload; })
      .addCase(fetchGolfers.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })

      // Fetch one
      .addCase(fetchGolfer.pending, (state) => { state.status = "loading"; })
      .addCase(fetchGolfer.fulfilled, (state, action) => { state.status = "succeeded"; state.selected = action.payload; })
      .addCase(fetchGolfer.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })

      // Add
      .addCase(addGolfer.fulfilled, (state, action) => { state.golfers.push(action.payload); })

      // Delete
      .addCase(deleteGolfer.fulfilled, (state, action) => { state.golfers = state.golfers.filter(g => g.id !== action.payload); })

      // Update
      .addCase(updateGolfer.fulfilled, (state, action) => {
        const index = state.golfers.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.golfers[index] = action.payload;
      });
  },
});

export default golfersSlice;
