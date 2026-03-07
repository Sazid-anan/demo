import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./slices/contentSlice";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import auditReducer from "./slices/auditSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    auth: authReducer,
    admin: adminReducer,
    audit: auditReducer,
  },
});

export default store;
