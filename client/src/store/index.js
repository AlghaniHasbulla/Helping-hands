import { configureStore } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import donationsReducer from './donationsSlice';
import categoriesReducer from './categoriesSlice';
import requestsReducer from './requestsSlice';
import usersReducer from './usersSlice';
import logsReducer from './logsSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'isAuthenticated'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    
    auth: persistedAuthReducer,

    donations: donationsReducer,  
    categories: categoriesReducer,     
    requests: requestsReducer,         
    users: usersReducer,               
    logs: logsReducer,                  
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

export default store;