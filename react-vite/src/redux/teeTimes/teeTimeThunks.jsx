import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateTeeTimeInStore } from "./teeTimeSlice";

// Fetch tee times for a course on a given date
export const fetchTeeTimes = createAsyncThunk(
  "teeTimes/fetchTeeTimes",
  async ({ courseId, date }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/tee_time/?course_id=${courseId}&date=${date}`);
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to fetch tee times");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a new tee time
export const createTeeTime = createAsyncThunk(
  "teeTimes/createTeeTime",
  async (teeTimeData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/tee_time/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teeTimeData),
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to create tee time");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Edit a tee time
export const editTeeTime = createAsyncThunk(
  "teeTimes/editTeeTime",
  async ({ teeTimeId, teeTimeData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/tee_time/edit/${teeTimeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teeTimeData),
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to edit tee time");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a tee time
export const deleteTeeTime = createAsyncThunk(
  "teeTimes/deleteTeeTime",
  async (teeTimeId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/tee_time/delete/${teeTimeId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to delete tee time");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const editTeeTimeStatus = createAsyncThunk(
  "teeTimes/editTeeTimeStatus",
  async ({ teeTimeId, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/tee_time/${teeTimeId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to update tee time status");
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


//fetch a single tee time by id
export const fetchSingleTeeTime = createAsyncThunk(
  "teeTimes/fetchSingleTeeTime",
  async (teeTimeId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/tee_time/${teeTimeId}`);
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to fetch tee time");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
