import { describe, it, expect } from "vitest";

/**
 * Form Validation Tests
 * Tests for form field validation logic
 */

// Validation functions
const validateForm = (values) => {
  const errors = {};

  // Name validation
  if (!values.name || values.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email validation
  if (!values.email || values.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Message validation
  if (!values.message || values.message.trim().length === 0) {
    errors.message = "Message is required";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
};

describe("Form Validation", () => {
  describe("Name Validation", () => {
    it("should require name", () => {
      const errors = validateForm({
        name: "",
        email: "test@test.com",
        message: "This is a test message",
      });
      expect(errors.name).toBe("Name is required");
    });

    it("should require minimum 2 characters", () => {
      const errors = validateForm({
        name: "A",
        email: "test@test.com",
        message: "This is a test message",
      });
      expect(errors.name).toBe("Name must be at least 2 characters");
    });

    it("should accept valid name", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "test@test.com",
        message: "This is a test message",
      });
      expect(errors.name).toBeUndefined();
    });
  });

  describe("Email Validation", () => {
    it("should require email", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "",
        message: "This is a test message",
      });
      expect(errors.email).toBe("Email is required");
    });

    it("should validate email format", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "invalid-email",
        message: "This is a test message",
      });
      expect(errors.email).toBe("Please enter a valid email address");
    });

    it("should accept valid email", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message",
      });
      expect(errors.email).toBeUndefined();
    });
  });

  describe("Message Validation", () => {
    it("should require message", () => {
      const errors = validateForm({ name: "John Doe", email: "john@example.com", message: "" });
      expect(errors.message).toBe("Message is required");
    });

    it("should require minimum 10 characters", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "john@example.com",
        message: "Short",
      });
      expect(errors.message).toBe("Message must be at least 10 characters");
    });

    it("should accept valid message", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message",
      });
      expect(errors.message).toBeUndefined();
    });
  });

  describe("Full Form Validation", () => {
    it("should accept completely valid form", () => {
      const errors = validateForm({
        name: "John Doe",
        email: "john@example.com",
        phone: "+44 123 456 7890",
        message: "This is a complete and valid test message",
      });
      expect(Object.keys(errors).length).toBe(0);
    });

    it("should return multiple errors", () => {
      const errors = validateForm({
        name: "",
        email: "invalid",
        message: "Short",
      });
      expect(Object.keys(errors).length).toBe(3);
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.message).toBeDefined();
    });
  });
});
