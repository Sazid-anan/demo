// Error types and interfaces for type-safe error handling

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "not_found",
  SERVER_ERROR = "server_error",
  CLIENT_ERROR = "client_error",
  UNKNOWN = "unknown",
}

export interface ErrorMetadata {
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  breadcrumbs?: string[];
  context?: Record<string, any>;
}

export interface LoggedError {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  stack?: string;
  metadata: ErrorMetadata;
  originalError?: Error;
  retryable: boolean;
  retryCount: number;
}

export interface ErrorReport {
  errors: LoggedError[];
  timestamp: number;
  deviceInfo: {
    os: string;
    browser: string;
    viewport: {
      width: number;
      height: number;
    };
  };
}

// Custom error class for application errors
export class AppError extends Error {
  constructor(
    message: string,
    public category: ErrorCategory = ErrorCategory.UNKNOWN,
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public retryable: boolean = false,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Network error
export class NetworkError extends AppError {
  constructor(
    message: string,
    public statusCode: number = 0,
  ) {
    super(
      message,
      ErrorCategory.NETWORK,
      ErrorSeverity.MEDIUM,
      statusCode !== 401 && statusCode !== 403, // Retry non-auth errors
    );
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

// Validation error
export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors: Record<string, string> = {},
  ) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, false);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Authentication error
export class AuthError extends AppError {
  constructor(
    message: string,
    public code: string = "AUTH_ERROR",
  ) {
    super(
      message,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      code === "SESSION_EXPIRED", // Retry on session expiry
    );
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// Authorization error
export class PermissionError extends AppError {
  constructor(
    message: string,
    public requiredPermissions: string[] = [],
  ) {
    super(message, ErrorCategory.AUTHORIZATION, ErrorSeverity.MEDIUM, false);
    this.name = "PermissionError";
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(
    message: string,
    public resourceType: string = "resource",
  ) {
    super(message, ErrorCategory.NOT_FOUND, ErrorSeverity.LOW, false);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// Server error
export class ServerError extends AppError {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(
      message,
      ErrorCategory.SERVER_ERROR,
      statusCode === 503 ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
      true, // Server errors are usually retryable
    );
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

// Utility to check if error is retryable
export const isRetryableError = (error: any): boolean => {
  if (error instanceof AppError) {
    return error.retryable;
  }
  // Retry network errors by default
  return error instanceof TypeError && error.message.includes("fetch");
};

// Utility to extract error message
export const getErrorMessage = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// Utility to categorize errors
export const categorizeError = (error: any): ErrorCategory => {
  if (error instanceof ValidationError) return ErrorCategory.VALIDATION;
  if (error instanceof AuthError) return ErrorCategory.AUTHENTICATION;
  if (error instanceof PermissionError) return ErrorCategory.AUTHORIZATION;
  if (error instanceof NotFoundError) return ErrorCategory.NOT_FOUND;
  if (error instanceof ServerError) return ErrorCategory.SERVER_ERROR;
  if (error instanceof NetworkError) return ErrorCategory.NETWORK;

  const message = getErrorMessage(error);
  if (message.includes("404")) return ErrorCategory.NOT_FOUND;
  if (message.includes("401")) return ErrorCategory.AUTHENTICATION;
  if (message.includes("403")) return ErrorCategory.AUTHORIZATION;
  if (message.includes("5")) return ErrorCategory.SERVER_ERROR;
  if (message.includes("network")) return ErrorCategory.NETWORK;

  return ErrorCategory.UNKNOWN;
};

// User-friendly error messages
export const getFriendlyMessage = (error: any): string => {
  const category = categorizeError(error);

  switch (category) {
    case ErrorCategory.NETWORK:
      return "Network error. Please check your connection and try again.";
    case ErrorCategory.VALIDATION:
      return "Please check your input and try again.";
    case ErrorCategory.AUTHENTICATION:
      return "Your session has expired. Please log in again.";
    case ErrorCategory.AUTHORIZATION:
      return "You don't have permission to perform this action.";
    case ErrorCategory.NOT_FOUND:
      return "The requested resource was not found.";
    case ErrorCategory.SERVER_ERROR:
      return "Server error. Our team has been notified. Please try again later.";
    case ErrorCategory.CLIENT_ERROR:
      return "An error occurred. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
