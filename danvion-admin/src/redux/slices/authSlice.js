import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

const TOKEN_STORAGE_KEY = "danvion_admin_token";

/**
 * Auth Slice
 * Manages admin authentication state with JWT authentication
 */

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Call PHP API login endpoint
      const response = await apiClient.post("/auth/login.php", {
        email,
        password,
      });

      if (response.success && response.data) {
        // Store JWT token in apiClient
        apiClient.setToken(response.data.token);

        return {
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || "Login failed");
      }
    } catch (error) {
      const message =
        error?.message || error?.toString() || "Invalid email or password";
      return rejectWithValue(message);
    }
  },
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      // Call PHP API logout endpoint (optional, JWT is stateless)
      await apiClient.post("/auth/logout.php", {});

      // Clear token from apiClient
      apiClient.clearToken();

      return true;
    } catch (error) {
      const message = error?.message || "Failed to sign out";
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    adminEmail: "",
    adminRole: "viewer", // 'admin' | 'editor' | 'viewer'
    loginError: null,
    loading: false,
  },
  reducers: {
    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    setAuthUser: (state, action) => {
      state.isLoggedIn = true;
      state.adminEmail = action.payload?.email || "";
      state.adminRole = action.payload?.role || "viewer";
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(
              TOKEN_STORAGE_KEY,
              action.payload.token,
            );
          } catch {
            // Ignore storage write failures and continue with in-memory auth.
          }
        }
        state.loading = false;
        state.isLoggedIn = true;
        state.adminEmail = action.payload.email;
        state.adminRole = action.payload.role;
        state.loginError = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload || "Login failed";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          } catch {
            // Ignore storage cleanup failures.
          }
        }
        state.isLoggedIn = false;
        state.adminEmail = "";
        state.adminRole = "viewer";
        state.loginError = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loginError = action.payload || "Logout failed";
      });
  },
});

export const { setLoginError, clearLoginError, setAuthUser } =
  authSlice.actions;

export default authSlice.reducer;
