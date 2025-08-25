import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReservations,
  createReservation,
  deleteReservation,
  updateReservation,
} from "./reservationsThunks";

const reservationSlice = createSlice({
  name: "reservations",
  initialState: {
    reservations: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReservations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservations = action.payload; // array of { reservation, golfers }
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push({
          reservation: action.payload,
          golfers: [], // initialize empty golfers array if needed
        });
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter(
          (r) => r && r.reservation && r.reservation.id !== action.payload
        );
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(
          (r) => r?.reservation?.id === action.payload.id
        );
        if (index !== -1) {
          state.reservations[index].reservation = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reservationSlice.reducer;
