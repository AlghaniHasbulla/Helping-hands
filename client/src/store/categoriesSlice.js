import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../lib/adminService';

// --- Async Thunks ---
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  return await getCategories();
});

export const addCategory = createAsyncThunk('categories/addCategory', async (categoryData) => {
  return await createCategory(categoryData);
});

export const editCategory = createAsyncThunk('categories/editCategory', async ({ id, updateData }) => {
  return await updateCategory(id, updateData);
});

export const removeCategory = createAsyncThunk('categories/removeCategory', async (id) => {
  await deleteCategory(id);
  return id; // Return the id to use in the reducer
});

// --- Slice Definition ---
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit Category
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove Category
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;