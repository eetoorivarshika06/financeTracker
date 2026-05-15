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

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
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
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
