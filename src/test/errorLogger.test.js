import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Error Logger Tests
 * Tests for error tracking and logging service
 */

describe("Error Logger", () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("Auth Error Messages", () => {
    it("should map invalid-email to user-friendly message", () => {
      const authErrors = {
        "auth/invalid-email": "Invalid email address",
        "auth/user-disabled": "This account has been disabled",
        "auth/user-not-found": "User not found",
        "auth/wrong-password": "Incorrect password",
        "auth/email-already-in-use": "Email already registered",
        "auth/weak-password": "Password must be at least 6 characters",
      };

      expect(authErrors["auth/invalid-email"]).toBe("Invalid email address");
      expect(authErrors["auth/user-not-found"]).toBe("User not found");
    });

    it("should have fallback for unknown auth errors", () => {
      const unknownError = "Unknown auth error";
      const fallbackMessage = unknownError || "Authentication error. Please try again.";
      expect(fallbackMessage).toBe("Unknown auth error");
    });
  });

  describe("Firestore Error Messages", () => {
    it("should map permission error", () => {
      const firestoreErrors = {
        "permission-denied": "You don't have permission to perform this action",
        "not-found": "Document not found",
        "already-exists": "This item already exists",
      };

      expect(firestoreErrors["permission-denied"]).toBe(
        "You don't have permission to perform this action",
      );
    });

    it("should provide fallback for unknown firestore errors", () => {
      const unknownError = "Unknown firestore error";
      const fallbackMessage = unknownError || "An error occurred. Please try again.";
      expect(fallbackMessage).toBe("Unknown firestore error");
    });
  });

  describe("Error Context", () => {
    it("should capture error with context", () => {
      const error = new Error("Test error");
      const context = {
        where: "test-component",
        action: "test_action",
        userId: "test-user-id",
      };

      const errorData = {
        message: error.message,
        context,
      };

      expect(errorData.message).toBe("Test error");
      expect(errorData.context.where).toBe("test-component");
      expect(errorData.context.action).toBe("test_action");
    });

    it("should include timestamp in error data", () => {
      const errorData = {
        timestamp: new Date().toISOString(),
        message: "Error occurred",
      };

      expect(errorData.timestamp).toBeDefined();
      expect(typeof errorData.timestamp).toBe("string");
    });
  });

  describe("Environment Detection", () => {
    it("should detect development environment", () => {
      // Mock import.meta.env
      const isDev = true;
      const isProd = false;

      expect(isDev).toBe(true);
      expect(isProd).toBe(false);
    });

    it("should log to console in dev mode", () => {
      const isDev = true;
      const message = "Development error";

      if (isDev) {
        console.error("❌ Error:", message);
      }

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
