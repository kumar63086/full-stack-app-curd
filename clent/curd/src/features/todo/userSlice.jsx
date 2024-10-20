import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8080/api/';

// Fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getusers`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch users.', { autoClose: 3000 });
      return rejectWithValue(error.response?.data || 'An error occurred while fetching users');
    }
  }
);

// Add a new user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (user) => {
    try {
      const response = await axios.post(`${API_URL}/User`, user); // Passing user object
      toast.success('User added successfully!' );
      return response.data;
    } catch (error) {
      toast.error('Failed to add user.');
      return error
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/updateuser/${id}`, data);
      toast.success('User updated successfully!', { autoClose: 3000 });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update user. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, ) => {
    try {
      await axios.delete(`${API_URL}/deleteuser/${id}`);
      toast.success('User deleted successfully!', { autoClose: 3000 });
      return id; // Returning the id to remove it from the state
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
      return error
    }
  }
);

// Fetch a user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/induser/${id}`);
      toast.success('User fetched successfully!', { autoClose: 3000 });
      return response.data; // Return the user data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch user. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a slice for user management
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Assuming the payload is the new user
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload; // Update the user in the state
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload); // Remove the user from the state
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store the fetched user
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export const { clearError } = userSlice.actions;
export default userSlice.reducer;
