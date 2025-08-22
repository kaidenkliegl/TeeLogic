import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all golfers
export const fetchGolfers = createAsyncThunk(
  'golfers/fetchAll',
  async (_, { rejectWithValue }) => {
    const res = await fetch('/api/golfers/');
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || 'Failed to fetch golfers');
    }
    const data = await res.json();
    return data.golfers; 
  }
);

// Fetch one golfer
export const fetchGolfer = createAsyncThunk(
  "golfers/fetchOne",
  async (golferId, { rejectWithValue }) => {
    const res = await fetch(`/api/golfers/${golferId}/one`);
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || 'Failed to fetch golfer');
    }
    return await res.json();
  }
);

// Add a golfer
export const addGolfer = createAsyncThunk(
  "golfers/add",
  async (golferData, { rejectWithValue }) => {
    const res = await fetch("/api/golfers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(golferData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.errors || 'Failed to add golfer');
    }
    return await res.json();
  }
);

// Delete a golfer
export const deleteGolfer = createAsyncThunk(
  "golfers/delete",
  async (golferId, { rejectWithValue }) => {
    const res = await fetch(`/api/golfers/${golferId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || 'Failed to delete golfer');
    }
    return golferId;
  }
);

// Update a golfer
export const updateGolfer = createAsyncThunk(
  "golfers/update",
  async ({ id, updates }, { rejectWithValue }) => {
    const res = await fetch(`/api/golfers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.errors || 'Failed to update golfer');
    }
    return await res.json();
  }
);

export const fetchGolferReservations = createAsyncThunk(
  "golfers/fetchReservations",
  async (golferId, { rejectWithValue }) => {
    console.log(golferId)
    const res = await fetch(`/api/golfers/${golferId}/reservations`, { credentials: "include" });
    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.message || "Error fetching reservations");
    }
    return await res.json(); 
  }
);