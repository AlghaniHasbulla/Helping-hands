// src/store/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Note: your adminService.js exports 'createCategory', which is fine.
// The thunk itself can have a different name, but we should make it match what the component expects.
import { getCategories, createCategory as apiCreateCategory, updateCategory, deleteCategory } from '../lib/adminService';

// --- Async Thunks ---
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  return await getCategories();
});

// --- FIX IS HERE ---
// Rename the thunk from 'addCategory' to 'createCategory' to match the import.
export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData) => {
  // Also, let's call the imported API function with a different name to avoid confusion.
  return await apiCreateCategory(categoryData);
});

export const editCategory = createAsyncThunk('categories/editCategory', async ({ id, updateData }) => {
  return await updateCategory(id, updateData);
});

export const removeCategory = createAsyncThunk('categories/removeCategory', async (id) => {
  await deleteCategory(id);
  return id;
});

// --- Slice Definition ---
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ... (rest of the extraReducers)
      // --- FIX IS HERE ---
      // Make sure the case matches the new thunk name.
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
      // ... (rest of the extraReducers)
  },
});

export default categoriesSlice.reducer;