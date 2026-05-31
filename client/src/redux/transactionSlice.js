import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/transactions");
      return data.transactions || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load transactions");
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/transactions", payload);
      return data.transaction;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add transaction");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/transactions/${id}`, payload);
      return data.transaction;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update transaction");
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete transaction");
    }
  }
);

export const categorizeMerchant = createAsyncThunk(
  "transactions/categorize",
  async ({ merchantName, amount }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/ai/categorize", { merchantName, amount });
      return data.category;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to detect category");
    }
  }
);

export const batchRecategorize = createAsyncThunk(
  "transactions/batchRecategorize",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/ai/categorize/batch");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to re-categorize");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    submitting: false,
    categorizing: false,
    batchRecategorizing: false,
    error: null,
    batchMessage: null,
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearBatchMessage: (state) => {
      state.batchMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      .addCase(addTransaction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.items.findIndex((t) => t._id === action.payload._id);
          if (idx !== -1) state.items[idx] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(categorizeMerchant.pending, (state) => {
        state.categorizing = true;
        state.error = null;
      })
      .addCase(categorizeMerchant.fulfilled, (state) => {
        state.categorizing = false;
      })
      .addCase(categorizeMerchant.rejected, (state, action) => {
        state.categorizing = false;
        state.error = action.payload;
      })
      .addCase(batchRecategorize.pending, (state) => {
        state.batchRecategorizing = true;
        state.error = null;
        state.batchMessage = null;
      })
      .addCase(batchRecategorize.fulfilled, (state, action) => {
        state.batchRecategorizing = false;
        state.batchMessage = action.payload.message;
      })
      .addCase(batchRecategorize.rejected, (state, action) => {
        state.batchRecategorizing = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError, clearBatchMessage } = transactionSlice.actions;
export default transactionSlice.reducer;
