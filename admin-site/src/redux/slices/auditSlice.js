import { createSlice } from "@reduxjs/toolkit";

/**
 * Audit Slice
 * Tracks admin activities for accountability and debugging
 */
const auditSlice = createSlice({
  name: "audit",
  initialState: {
    logs: [], // Array of audit log entries
    maxLogs: 500, // Keep last 500 logs in memory
  },
  reducers: {
    addAuditLog: (state, action) => {
      const log = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        adminEmail: action.payload.adminEmail,
        adminRole: action.payload.adminRole,
        action: action.payload.action, // 'create', 'update', 'delete', 'login', 'logout'
        section: action.payload.section, // 'products', 'blogs', 'team', 'testimonials', 'messages', 'settings', 'email'
        itemId: action.payload.itemId || null,
        itemName: action.payload.itemName || null,
        description: action.payload.description || "",
        changes: action.payload.changes || null, // For tracking what changed
        ipAddress: action.payload.ipAddress || null,
        status: action.payload.status || "success", // 'success' or 'error'
        errorMessage: action.payload.errorMessage || null,
      };

      state.logs.unshift(log); // Add to beginning

      // Keep only last maxLogs entries
      if (state.logs.length > state.maxLogs) {
        state.logs = state.logs.slice(0, state.maxLogs);
      }
    },
    clearAuditLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addAuditLog, clearAuditLogs } = auditSlice.actions;

export default auditSlice.reducer;
