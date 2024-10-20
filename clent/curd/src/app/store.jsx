import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/Users/userSlice'; // Adjust the path accordingly

const store = configureStore({
  reducer: {
    users: userReducer, // This key should match the slice name
  },
});

export default store;
