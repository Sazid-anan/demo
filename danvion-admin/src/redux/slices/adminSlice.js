import { createSlice } from "@reduxjs/toolkit";

/**
 * Admin Slice
 * Manages admin panel UI state and content editing
 */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    activeTab: "analytics", // 'analytics', 'products', 'team', 'testimonials', 'messages'
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = adminSlice.actions;

export default adminSlice.reducer;
