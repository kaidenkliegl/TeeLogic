import { createSlice } from "@reduxjs/toolkit";
import { fetchTeeTimes, createTeeTime, editTeeTime, deleteTeeTime } from "./teeTimeThunks";

const teeTimeSlice = createSlice({
  name: "teeTimes",
  initialState: {
    teeTimes: [],
    current: null,   // holds the current tee time being viewed/edited
    status: "idle",  // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // ✅ Manually set current tee time (e.g. from a list click)
    setCurrentTeeTime: (state, action) => {
      state.current = action.payload;
    },
    clearCurrentTeeTime: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Tee Times
      .addCase(fetchTeeTimes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeeTimes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teeTimes = action.payload;
      })
      .addCase(fetchTeeTimes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Create Tee Time
      .addCase(createTeeTime.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTeeTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teeTimes.push(action.payload);
        state.current = action.payload; // set new tee time as current
      })
      .addCase(createTeeTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Edit Tee Time
      .addCase(editTeeTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        const index = state.teeTimes.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          state.teeTimes[index] = updated;
        }
        state.current = updated; // update current if it’s the one being viewed
      })
      .addCase(editTeeTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Delete Tee Time
      .addCase(deleteTeeTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = action.payload.tee_time.id;
        state.teeTimes = state.teeTimes.filter((t) => t.id !== deletedId);
        if (state.current && state.current.id === deletedId) {
          state.current = null; // clear current if it was deleted
        }
      })
      .addCase(deleteTeeTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentTeeTime, clearCurrentTeeTime } = teeTimeSlice.actions;
export default teeTimeSlice.reducer;
