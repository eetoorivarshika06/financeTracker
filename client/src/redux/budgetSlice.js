import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchBudget = createAsyncThunk(
  "budget/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/budget");
      return data.budget || { monthlyBudget: 0, categoryBudgets: [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load budget");
    }
  }
);

export const saveBudget = createAsyncThunk(
  "budget/save",
  async (monthlyBudget, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/budget", {
        monthlyBudget: Number(monthlyBudget),
      });
      return data.budget;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save budget");
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    data: { monthlyBudget: 0, categoryBudgets: [] },
    loading: false,
    saving: false,
    fetched: false,
    error: null,
    success: false,
  },
  reducers: {
    clearBudgetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.data = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.error = action.payload;
      })
      .addCase(saveBudget.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveBudget.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(saveBudget.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearBudgetStatus } = budgetSlice.actions;
export default budgetSlice.reducer;
