import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./slices/contentSlice";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";

/**
 * Redux Store Configuration
 * Manages global state for:
 * - Content (pages, products, images)
 * - Admin panel state
 * - Authentication
 */

export const store = configureStore({
  reducer: {
    content: contentReducer,
    admin: adminReducer,
    auth: authReducer,
  },
});

export default store;
