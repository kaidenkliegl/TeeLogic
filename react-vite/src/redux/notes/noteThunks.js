import { createAsyncThunk } from "@reduxjs/toolkit";

// get note
export const fetchNote = createAsyncThunk(
  "note/fetchNote",
  async (teeTimeId, { rejectWithValue }) => {
    const res = await fetch(`/api/notes/${teeTimeId}`);
    if (!res.ok) {
      return rejectWithValue("Failed to fetch note");
    }
    return await res.json();
  }
);

// Save 
export const saveNote = createAsyncThunk(
  "note/saveNote",
  async ({ teeTimeId, content }, { rejectWithValue }) => {
    const res = await fetch(`/api/notes/tee-time/${teeTimeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      return rejectWithValue("Failed to save note");
    }
    return await res.json();
  }
);

