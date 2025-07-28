import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPendingRequests, approveRequest, rejectRequest } from '../lib/adminService';

// --- Async Thunks ---
export const fetchPendingRequests = createAsyncThunk('requests/fetchPending', async () => {
  return await getPendingRequests();
});

export const processApproveRequest = createAsyncThunk('requests/approve', async (id) => {
  const updatedRequest = await approveRequest(id);
  return updatedRequest.id; // Return the ID of the processed request
});

export const processRejectRequest = createAsyncThunk('requests/reject', async (id) => {
  const updatedRequest = await rejectRequest(id);
  return updatedRequest.id; // Return the ID of the processed request
});

// --- Slice Definition ---
const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Pending Requests
      .addCase(fetchPendingRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // After approving or rejecting, remove the request from the pending list
      .addCase(processApproveRequest.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(processRejectRequest.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default requestsSlice.reducer;