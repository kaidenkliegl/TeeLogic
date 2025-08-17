import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all golfers
export const fetchGolfers = createAsyncThunk(
  "golfers/fetchAll",
  async () => {
    const res = await fetch("/api/golfers");
    if (!res.ok) throw new Error("Failed to fetch golfers");
    return await res.json();
  }
);

// Fetch one golfer
export const fetchGolfer = createAsyncThunk(
  "golfers/fetchOne",
  async (golferId) => {
    const res = await fetch(`/api/golfers/${golferId}`);
    if (!res.ok) throw new Error("Failed to fetch golfer");
    return await res.json();
  }
);

// Add a golfer
export const addGolfer = createAsyncThunk(
  "golfers/add",
  async (golferData) => {
    const res = await fetch("/api/golfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(golferData),
    });
    if (!res.ok) throw new Error("Failed to add golfer");
    return await res.json();
  }
);

// Delete a golfer
export const deleteGolfer = createAsyncThunk(
  "golfers/delete",
  async (golferId) => {
    const res = await fetch(`/api/golfers/${golferId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete golfer");
    return golferId; // just return the ID so slice can remove it
  }
);

// Update a golfer
export const updateGolfer = createAsyncThunk(
  "golfers/update",
  async ({ id, updates }) => {
    const res = await fetch(`/api/golfers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update golfer");
    return await res.json();
  }
);
