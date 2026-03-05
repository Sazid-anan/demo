import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./slices/contentSlice";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import auditReducer from "./slices/auditSlice";

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
    admin: adminReducer,
    auth: authReducer,
    audit: auditReducer,
  },
});

export default store;
