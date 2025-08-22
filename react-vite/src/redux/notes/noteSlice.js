import { createSlice } from "@reduxjs/toolkit";
import { fetchNote, saveNote } from "./noteThunks";

const noteSlice = createSlice({
  name: "note",
  initialState: {
    note: null,
    status: "idle",
    error: null,
    saving: false,
  },
  reducers: {
    updateLocalNote: (state, action) => {
      if (state.note) {
        state.note.content = action.payload; // live update while typing
      } else {
        state.note = { content: action.payload }; 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.note = action.payload;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveNote.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        state.saving = false;
        state.note = action.payload;
      })
      .addCase(saveNote.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { updateLocalNote } = noteSlice.actions;
export default noteSlice.reducer;
