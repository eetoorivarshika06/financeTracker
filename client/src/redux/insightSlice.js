import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchDashboard = createAsyncThunk(
  "insight/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/dashboard/summary");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  }
);

export const fetchInsights = createAsyncThunk(
  "insight/fetchInsights",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/ai/insights");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load insights");
    }
  }
);

export const fetchMonthlyReport = createAsyncThunk(
  "insight/fetchReport",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/reports/monthly");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load report");
    }
  }
);

const insightSlice = createSlice({
  name: "insight",
  initialState: {
    dashboard: null,
    insights: [],
    provider: null,
    report: null,
    dashboardLoading: false,
    insightsLoading: false,
    reportLoading: false,
    dashboardError: null,
    insightsError: null,
    reportError: null,
  },
  reducers: {
    clearInsightErrors: (state) => {
      state.dashboardError = null;
      state.insightsError = null;
      state.reportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      })
      .addCase(fetchInsights.pending, (state) => {
        state.insightsLoading = true;
        state.insightsError = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.insightsLoading = false;
        state.insights = action.payload.insights || [];
        state.provider = action.payload.provider || null;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.insightsLoading = false;
        state.insightsError = action.payload;
      })
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.reportLoading = true;
        state.reportError = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.report = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.reportLoading = false;
        state.reportError = action.payload;
      });
  },
});

export const { clearInsightErrors } = insightSlice.actions;
export default insightSlice.reducer;
