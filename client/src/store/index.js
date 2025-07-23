import { configureStore } from '@reduxjs/toolkit';
import donationsReducer from './donationsSlice';

const store = configureStore({
  reducer: {
    donations: donationsReducer,
  },
});

export default store;
