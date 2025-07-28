import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import donationsReducer from './donationsSlice';

const store = configureStore({
  reducer: {
    donations: donationsReducer,
    auth: authReducer,
  },
});

export default store;
