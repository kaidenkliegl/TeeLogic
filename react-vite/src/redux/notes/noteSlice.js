import { createSlice } from "@reduxjs/toolkit";
import { fetchNote, saveNote } from "./noteThunks";

const noteSlice = createSlice({
  name: "note",
  initialState: {
    note: null, // only store the current note
  },
  reducers: {
    updateLocalNote: (state, action) => {
      // live update while typing
      state.note = state.note ? { ...state.note, content: action.payload } : { content: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.note = action.payload;
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        state.note = action.payload;
      });
  },
});

export const { updateLocalNote } = noteSlice.actions;
export default noteSlice.reducer;

