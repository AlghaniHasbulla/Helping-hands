import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

export const fetchApprovedRequests = createAsyncThunk(
  'donations/fetchApprovedRequests',
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/requests?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchNGORequests = createAsyncThunk(
  'donations/fetchNGORequests',
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/ngo/my-requests?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchDonationsToMyRequests = createAsyncThunk(
  'donations/fetchDonationsToMyRequests',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/ngo/donations-received');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createDonationRequest = createAsyncThunk(
  'donations/createDonationRequest',
  async (requestData, thunkAPI) => {
    try {
      const response = await api.post('/requests', requestData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const makeDonation = createAsyncThunk(
  'donations/makeDonation',
  async (donationData, thunkAPI) => {
    try {
      const response = await api.post('/donate', donationData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchDonationHistory = createAsyncThunk(
  'donations/fetchDonationHistory',
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/donations?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const donationsSlice = createSlice({
  name: 'donations',
  initialState: {
    approvedRequests: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
    ngoRequests: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
    donationHistory: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
    createRequestStatus: { loading: false, error: null },
    makeDonationStatus: { loading: false, error: null },
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // fetchApprovedRequests
      .addCase(fetchApprovedRequests.pending, (state) => {
        state.approvedRequests.loading = true;
        state.approvedRequests.error = null;
      })
      .addCase(fetchApprovedRequests.fulfilled, (state, action) => {
        state.approvedRequests.loading = false;
        state.approvedRequests.items = action.payload.items;
        state.approvedRequests.total = action.payload.total;
        state.approvedRequests.page = action.payload.page;
        state.approvedRequests.limit = action.payload.limit;
      })
      .addCase(fetchApprovedRequests.rejected, (state, action) => {
        state.approvedRequests.loading = false;
        state.approvedRequests.error = action.payload || action.error.message;
      })

      // fetchNGORequests
      .addCase(fetchNGORequests.pending, (state) => {
        state.ngoRequests.loading = true;
        state.ngoRequests.error = null;
      })
      .addCase(fetchNGORequests.fulfilled, (state, action) => {
        state.ngoRequests.loading = false;
        state.ngoRequests.items = action.payload.items;
        state.ngoRequests.total = action.payload.total;
        state.ngoRequests.page = action.payload.page;
        state.ngoRequests.limit = action.payload.limit;
      })
      .addCase(fetchNGORequests.rejected, (state, action) => {
        state.ngoRequests.loading = false;
        state.ngoRequests.error = action.payload || action.error.message;
      })

      // createDonationRequest
      .addCase(createDonationRequest.pending, (state) => {
        state.createRequestStatus.loading = true;
        state.createRequestStatus.error = null;
      })
      .addCase(createDonationRequest.fulfilled, (state, action) => {
        state.createRequestStatus.loading = false;
        state.ngoRequests.items.unshift(action.payload);
      })
      .addCase(createDonationRequest.rejected, (state, action) => {
        state.createRequestStatus.loading = false;
        state.createRequestStatus.error = action.payload || action.error.message;
      })

      // makeDonation
      .addCase(makeDonation.pending, (state) => {
        state.makeDonationStatus.loading = true;
        state.makeDonationStatus.error = null;
      })
      .addCase(makeDonation.fulfilled, (state, action) => {
        state.makeDonationStatus.loading = false;
        state.donationHistory.items.unshift(action.payload);
      })
      .addCase(makeDonation.rejected, (state, action) => {
        state.makeDonationStatus.loading = false;
        state.makeDonationStatus.error = action.payload || action.error.message;
      })

      // fetchDonationHistory
      .addCase(fetchDonationHistory.pending, (state) => {
        state.donationHistory.loading = true;
        state.donationHistory.error = null;
      })
      .addCase(fetchDonationHistory.fulfilled, (state, action) => {
        state.donationHistory.loading = false;
        state.donationHistory.items = action.payload.items;
        state.donationHistory.total = action.payload.total;
        state.donationHistory.page = action.payload.page;
        state.donationHistory.limit = action.payload.limit;
      })
      .addCase(fetchDonationHistory.rejected, (state, action) => {
        state.donationHistory.loading = false;
        state.donationHistory.error = action.payload || action.error.message;
      });
  }
});

export default donationsSlice.reducer;
