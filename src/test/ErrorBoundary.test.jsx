import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";

/**
 * Error Boundary Component Tests
 * Tests for the global error catching component
 */

describe("ErrorBoundary Component", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should render children when there is no error", () => {
    const TestComponent = () => <div>Test Content</div>;

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should have initial state with no errors", () => {
    const errorBoundary = new ErrorBoundary({});
    expect(errorBoundary.state.hasError).toBe(false);
    expect(errorBoundary.state.error).toBeNull();
    expect(errorBoundary.state.errorInfo).toBeNull();
  });

  it("should expose getDerivedStateFromError static method", () => {
    const error = new Error("Test error");
    const newState = ErrorBoundary.getDerivedStateFromError(error);

    // Verify getDerivedStateFromError returns hasError: true
    expect(newState).toEqual({ hasError: true });
  });
});
