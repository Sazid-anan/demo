import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseClient";

/**
 * Auth Slice
 * Manages admin authentication state
 * Simple login validation (no production security)
 */
const DEFAULT_ADMIN_EMAIL = "sazid@danvion.com";
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || DEFAULT_ADMIN_EMAIL)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (!ADMIN_EMAILS.includes(String(email || "").toLowerCase())) {
        return rejectWithValue("Unauthorized admin email");
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      return { email: result.user?.email || email };
    } catch (error) {
      const message = error?.message || "Invalid email or password";
      return rejectWithValue(message);
    }
  },
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
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
      if (
        action.payload?.email &&
        ADMIN_EMAILS.includes(String(action.payload.email).toLowerCase())
      ) {
        state.isLoggedIn = true;
        state.adminEmail = action.payload.email;
      } else {
        state.isLoggedIn = false;
        state.adminEmail = "";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.adminEmail = action.payload.email;
        state.loginError = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload || "Login failed";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.adminEmail = "";
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
