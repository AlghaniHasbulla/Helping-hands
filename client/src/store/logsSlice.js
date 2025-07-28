import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActionLogs } from '../lib/adminService';

// --- Async Thunk ---
export const fetchActionLogs = createAsyncThunk('logs/fetchActionLogs', async () => {
  return await getActionLogs();
});

// --- Slice Definition ---
const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActionLogs.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchActionLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchActionLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default logsSlice.reducer;