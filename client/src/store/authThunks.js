import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginSuccess } from './authSlice'; // Import the action from your slice
import { apiLogin } from '../lib/authService'; // Assuming login function is in an authService.js

/**
 * This is an async thunk for handling user login.
 * 1. It takes user credentials as an argument.
 * 2. It calls the API service to perform the login request.
 * 3. On success, it dispatches the `loginSuccess` action with the response data.
 * 4. On failure, it returns a rejected promise with the error message.
 */
export const loginUser = createAsyncThunk(
  'auth/login', // This is the action type prefix for Redux DevTools
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      // The apiLogin function should call your backend and return { user, accessToken }
      const response = await apiLogin(credentials);
      
      // If the API call is successful, dispatch the synchronous loginSuccess action
      // with the data received from the backend.
      dispatch(loginSuccess(response));
      
      return response; // Return the user data on success
    } catch (error) {
      // If the API call fails, return a serializable error object
      const message = error.response?.data?.error || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);