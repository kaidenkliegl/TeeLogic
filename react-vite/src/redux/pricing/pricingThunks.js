import { createAsyncThunk } from "@reduxjs/toolkit";

// GET all pricing rules
export const fetchPricingRules = createAsyncThunk(
    "pricing/fetchPricingRules",
    async () => {
      const res = await fetch("/api/pricing/");
      if (!res.ok) throw new Error("Failed to fetch pricing rules");
      const data = await res.json();
      return data;
    }
  );

// POST / create a pricing rule
export const createPricingRule = createAsyncThunk(
  "pricing/createPricingRule",
  async (payload, { rejectWithValue }) => {
      const res = await fetch("/api/pricing/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.errors || "Failed to create");
      }
      const data = await res.json();
      return data;
  }
);

// PUT / update a pricing rule
export const editPricingRule = createAsyncThunk(
  "pricing/editPricingRule",
  async ({ id, payload }, { rejectWithValue }) => {
      const res = await fetch(`/api/pricing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.errors || "Failed to update");
      }
      const data = await res.json();
      return data;
 
  }
);

// DELETE / remove a pricing rule
export const deletePricingRule = createAsyncThunk(
  "pricing/deletePricingRule",
  async (id, { rejectWithValue }) => {
      const res = await fetch(`/api/pricing/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || "Failed to delete");
      }
      return id; // return deleted id so reducer can remove it
  }
);
