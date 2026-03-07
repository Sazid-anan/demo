import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./slices/contentSlice";

/**
 * Redux Store Configuration
 * Manages global state for:
 * - Content (pages, products, images)
 * - Admin panel state
 * - Authentication
 * - Audit logs
 */

export const store = configureStore({
  reducer: {
    content: contentReducer,
  },
});

export default store;
