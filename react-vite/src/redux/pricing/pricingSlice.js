import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPricingRules,
  createPricingRule,
  editPricingRule,
  deletePricingRule,
} from "./pricingThunks";

const initialState = {
  pricingRules: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchPricingRules.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPricingRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pricingRules = action.payload;
      })
      .addCase(fetchPricingRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // CREATE
    builder
      .addCase(createPricingRule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPricingRule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pricingRules.push(action.payload);
      })
      .addCase(createPricingRule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // EDIT
    builder
      .addCase(editPricingRule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editPricingRule.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.pricingRules.findIndex(
          (rule) => rule.id === action.payload.id
        );
        if (index !== -1) {
          state.pricingRules[index] = action.payload;
        }
      })
      .addCase(editPricingRule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deletePricingRule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePricingRule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pricingRules = state.pricingRules.filter(
          (rule) => rule.id !== action.payload
        );
      })
      .addCase(deletePricingRule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default pricingSlice.reducer;
