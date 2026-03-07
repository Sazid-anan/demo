import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseClient";

/**
 * Auth Slice
 * Manages admin authentication state with role-based access
 * Supports multiple admins with different roles
 */

// Admin configuration - email:role mapping
const DEFAULT_ADMIN_CONFIG = "sazid@danvion.com:admin";
const ADMIN_CONFIG = (import.meta.env.VITE_ADMIN_CONFIG || DEFAULT_ADMIN_CONFIG)
  .split(",")
  .map((entry) => {
    const [email, role = "editor"] = entry.trim().split(":");
    return { email: email.toLowerCase(), role };
  })
  .filter((item) => item.email);

const ADMIN_MAP = Object.fromEntries(ADMIN_CONFIG.map((item) => [item.email, item.role]));

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const lowerEmail = String(email || "").toLowerCase();
      if (!ADMIN_MAP[lowerEmail]) {
        return rejectWithValue("Unauthorized admin email");
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = result.user?.email || email;
      const role = ADMIN_MAP[userEmail.toLowerCase()] || "viewer";

      return {
        email: userEmail,
        role: role,
      };
    } catch (error) {
      const message = error?.message || "Invalid email or password";
      return rejectWithValue(message);
    }
  },
);

export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    const message = error?.message || "Failed to sign out";
    return rejectWithValue(message);
  }
});

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
      const lowerEmail = String(action.payload?.email || "").toLowerCase();
      if (ADMIN_MAP[lowerEmail]) {
        state.isLoggedIn = true;
        state.adminEmail = action.payload.email;
        state.adminRole = ADMIN_MAP[lowerEmail];
      } else {
        state.isLoggedIn = false;
        state.adminEmail = "";
        state.adminRole = "viewer";
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
        state.adminRole = action.payload.role;
        state.loginError = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload || "Login failed";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
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

export const { setLoginError, clearLoginError, setAuthUser } = authSlice.actions;

export default authSlice.reducer;
