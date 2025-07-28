import { configureStore } from '@reduxjs/toolkit';
import donationsReducer from './donationsSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    donations: donationsReducer,
    auth: authReducer,
  },
});

export default store;
