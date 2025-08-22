import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGolfers,
  fetchGolfer,
  addGolfer,
  deleteGolfer,
  updateGolfer,
  fetchGolferReservations
} from "./golferThunk";


const initialState = {
  golfers: [],
  currentGolfer: null,
  reservations: [],    
  status: "idle",
  error: null,
  resStatus: "idle",   
  resError: null,
};

const golfersSlice = createSlice({
  name: "golfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all golfers
      .addCase(fetchGolfers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGolfers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.golfers = action.payload;
      })
      .addCase(fetchGolfers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch one golfer
      .addCase(fetchGolfer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGolfer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentGolfer = action.payload;
      })
      .addCase(fetchGolfer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add golfer
      .addCase(addGolfer.fulfilled, (state, action) => {
        state.golfers.push(action.payload);
      })

      // Delete golfer
      .addCase(deleteGolfer.fulfilled, (state, action) => {
        state.golfers = state.golfers.filter((g) => g.id !== action.payload);
      })

      // Update golfer
      .addCase(updateGolfer.fulfilled, (state, action) => {
        const index = state.golfers.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.golfers[index] = action.payload;
      })

      // Fetch golfer reservations
      .addCase(fetchGolferReservations.pending, (state) => {
        state.resStatus = "loading";
        state.resError = null;
      })
      .addCase(fetchGolferReservations.fulfilled, (state, action) => {
        state.resStatus = "succeeded";
        state.reservations = action.payload;
      })
      .addCase(fetchGolferReservations.rejected, (state, action) => {
        state.resStatus = "failed";
        state.resError = action.payload;
      });
  },
});

export default golfersSlice;
