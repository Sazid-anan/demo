import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./slices/contentSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    // No auth reducer in the public app.
  },
});

export default store;
