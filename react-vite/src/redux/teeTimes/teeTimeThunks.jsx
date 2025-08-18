import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch tee times for a course on a given date
export const fetchTeeTimes = createAsyncThunk(
  "teeTimes/fetchTeeTimes",
  async ({ courseId, date }, { rejectWithValue }) => {
    const res = await fetch(
      `/api/tee_time/?course_id=${courseId}&date=${date}`
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch tee times");
    }
    return await res.json();
  }
);

// Create a new tee time
export const createTeeTime = createAsyncThunk(
  "teeTimes/createTeeTime",
  async (teeTimeData, { rejectWithValue }) => {
      const res = await fetch("/api/tee_time/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teeTimeData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create tee time");
      }
      return await res.json();
    } 
);

// Edit a tee time
export const editTeeTime = createAsyncThunk(
  "teeTimes/editTeeTime",
  async ({ teeTimeId, teeTimeData }, { rejectWithValue }) => {
    const res = await fetch(`/api/tee_time/edit/${teeTimeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teeTimeData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to edit tee time");
    }
    return await res.json();
  }
);

// Delete a tee time
export const deleteTeeTime = createAsyncThunk(
  "teeTimes/deleteTeeTime",
  async (teeTimeId, { rejectWithValue }) => {
    const res = await fetch(`/api/tee_time/delete/${teeTimeId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete tee time");
    }
    return await res.json();
  }
);
