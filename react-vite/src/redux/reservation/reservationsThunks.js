import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all reservations for a tee time
export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async ({ teeTimeId }) => {
    const res = await fetch(`/api/reservations/${teeTimeId}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch reservations");
    }
    return await res.json();
  }
);

// Create a new reservation
export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async ({
    tee_time_id,
    golfer,
    total_price,
    phone_number,
    email,
    pricing_rule_id,
  }) => {
    const res = await fetch(`/api/reservations/create/${tee_time_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        golfer,
        total_price,
        phone_number,
        email,
        pricing_rule_id,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create reservation");
    }
    return await res.json();
  }
);

// Delete a reservation
export const deleteReservation = createAsyncThunk(
  "reservations/deleteReservation",
  async (reservationId) => {
    const res = await fetch(`/api/reservations/${reservationId}/delete`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete reservation");
    }
    return reservationId;
  }
);

export const updateReservation = createAsyncThunk(
  "reservations/updateReservation",
  async ({ reservationId, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });

      const responseData = await res.json();

      if (!res.ok) {
        return rejectWithValue(responseData);
      }

      return responseData;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

