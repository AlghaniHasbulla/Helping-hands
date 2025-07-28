import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, createUser, updateUser, deleteUser } from '../lib/adminService';

// --- Async Thunks ---
export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  return await getAllUsers();
});

export const addUser = createAsyncThunk('users/addUser', async (userData) => {
  return await createUser(userData);
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, updateData }) => {
  return await updateUser(id, updateData);
});

export const removeUser = createAsyncThunk('users/removeUser', async (id) => {
  await deleteUser(id);
  return id;
});

// --- Slice Definition ---
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.items = state.items.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;