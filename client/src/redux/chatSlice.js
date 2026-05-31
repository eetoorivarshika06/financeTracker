import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, history }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/ai/chat", { message, history });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get a response");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    provider: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: `user-${Date.now()}`,
        role: "user",
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.provider = null;
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.provider = action.payload.provider;
        state.messages.push({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: action.payload.reply,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearChat, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
