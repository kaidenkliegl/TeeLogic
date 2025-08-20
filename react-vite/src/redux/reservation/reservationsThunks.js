import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all reservations for a tee time
export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async ({ teeTimeId }, thunkAPI) => {
      const res = await fetch(`/api/reservations/${teeTimeId}`);
      const data = await res.json();
      return data;
    }
);

// Create a new reservation
export const createReservation = createAsyncThunk(
    "reservations/createReservation",
    async ({ tee_time_id, golfer, total_price }, thunkAPI) => {
      try {
        const res = await fetch(`/api/reservations/create/${tee_time_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            golfer,
            total_price,
          }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create reservation");
        return data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
      }
    }
  );
  

// Delete a reservation (mark as deleted)
export const deleteReservation = createAsyncThunk(
  "reservations/deleteReservation",
  async (reservationId, thunkAPI) => {
    try {
      const res = await fetch(`/api/reservations/delete/${reservationId}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete reservation");
      return reservationId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update a reservation
export const updateReservation = createAsyncThunk(
  "reservations/updateReservation",
  async ({ reservationId, total_price }, thunkAPI) => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update reservation");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
