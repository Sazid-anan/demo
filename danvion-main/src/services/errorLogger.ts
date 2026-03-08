import {
  ErrorCategory,
  ErrorSeverity,
  LoggedError,
  ErrorMetadata,
  ErrorReport,
  getErrorMessage,
  categorizeError,
  AppError,
} from "../utils/errorTypes";

const ERROR_LOG_KEY = "app_error_logs";
const MAX_STORED_ERRORS = 50;
const SESSION_ID = Math.random().toString(36).substr(2, 9);

class ErrorLogger {
  private errorQueue: LoggedError[] = [];
  private breadcrumbs: string[] = [];
  private maxBreadcrumbs = 20;
  isDev: boolean;
  isProd: boolean;

  constructor() {
    this.isDev = (import.meta as any).env.DEV;
    this.isProd = (import.meta as any).env.PROD;
    this.loadStoredErrors();
    this.setupGlobalErrorHandlers();
  }

  captureException(
    error: any,
    context: Record<string, any> = {},
    severity?: ErrorSeverity,
  ): LoggedError {
    const message = getErrorMessage(error);
    const category = categorizeError(error);
    const errorSeverity =
      severity || (error instanceof AppError ? error.severity : ErrorSeverity.MEDIUM);

    const loggedError: LoggedError = {
      id: this.generateErrorId(),
      message,
      category,
      severity: errorSeverity,
      stack: error instanceof Error ? error.stack : undefined,
      metadata: this.createMetadata(context),
      originalError: error instanceof Error ? error : undefined,
      retryable: error instanceof AppError ? error.retryable : false,
      retryCount: 0,
    };

    this.errorQueue.push(loggedError);
    this.persistErrors();

    const errorData = {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
      category,
      severity: errorSeverity,
      sessionId: SESSION_ID,
      breadcrumbs: [...this.breadcrumbs],
    };

    // Dev: Log to console
    if (this.isDev) {
      if (import.meta.env.DEV) {
        console.error("❌ Error:", errorData);
      }
    }

    // Prod: Send to error tracking service
    if (this.isProd) {
      this.sendToErrorService(errorData);
    }

    return loggedError;
  }

  addBreadcrumb(message: string, data?: Record<string, any>): void {
    const breadcrumb = `[${new Date().toISOString()}] ${message}`;
    this.breadcrumbs.push(breadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    if (this.isDev) {
      if (import.meta.env.DEV) {
        console.log("[Breadcrumb]", breadcrumb, data);
      }
    }
  }

  clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  getErrors(): LoggedError[] {
    return [...this.errorQueue];
  }

  getErrorsBySeverity(severity: ErrorSeverity): LoggedError[] {
    return this.errorQueue.filter((err) => err.severity === severity);
  }

  getErrorsByCategory(category: ErrorCategory): LoggedError[] {
    return this.errorQueue.filter((err) => err.category === category);
  }

  clearErrors(): void {
    this.errorQueue = [];
    localStorage.removeItem(ERROR_LOG_KEY);
  }

  generateReport(): ErrorReport {
    return {
      errors: this.errorQueue,
      timestamp: Date.now(),
      deviceInfo: {
        os: navigator.platform,
        browser: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };
  }

  exportLogs(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }

  downloadLogs(): void {
    const report = this.generateReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `error-logs-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      this.captureException(
        event.error || new Error(event.message),
        { type: "uncaught_error" },
        ErrorSeverity.HIGH,
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(
        event.reason || new Error("Unhandled Promise Rejection"),
        { type: "unhandled_rejection" },
        ErrorSeverity.HIGH,
      );
    });
  }

  private createMetadata(context?: Record<string, any>): ErrorMetadata {
    return {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: SESSION_ID,
      breadcrumbs: [...this.breadcrumbs],
      context,
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private persistErrors(): void {
    try {
      const errors = this.errorQueue.slice(-MAX_STORED_ERRORS);
      const serialized = errors.map((err) => ({
        ...err,
        originalError: undefined, // Don't serialize original error
      }));
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(serialized));
    } catch (e) {
      console.warn("Failed to persist errors:", e);
    }
  }

  private loadStoredErrors(): void {
    try {
      const stored = localStorage.getItem(ERROR_LOG_KEY);
      if (stored) {
        this.errorQueue = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load stored errors:", e);
    }
  }

  private sendToErrorService(errorData: any) {
    try {
      // Example: Send to custom logging endpoint
      if (import.meta.env.VITE_ERROR_REPORTING_ENDPOINT) {
        fetch(import.meta.env.VITE_ERROR_REPORTING_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorData),
        }).catch((e) => console.warn("Failed to report error:", e));
      }
      if (this.isDev) {
        if (import.meta.env.DEV) {
          console.log("Error logged:", errorData.message);
        }
      }
    } catch (err) {
      console.error("Failed to log error:", err);
    }
  }

  captureAuthError(error: any, action: string) {
    const authErrors: Record<string, string> = {
      "auth/invalid-email": "Invalid email address",
      "auth/user-disabled": "This account has been disabled",
      "auth/user-not-found": "User not found",
      "auth/wrong-password": "Incorrect password",
      "auth/email-already-in-use": "Email already registered",
      "auth/weak-password": "Password must be at least 6 characters",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };

    const userFriendlyMessage = authErrors[error.code] || "Authentication error. Please try again.";

    this.captureException(error, {
      type: "auth",
      action,
      userMessage: userFriendlyMessage,
    });

    return userFriendlyMessage;
  }

  /**
   * Capture Firestore errors
   */
  captureFirestoreError(error: any, operation: string) {
    const firestoreErrors: Record<string, string> = {
      "permission-denied": "You don't have permission to perform this action",
      "not-found": "Document not found",
      "already-exists": "This item already exists",
      "failed-precondition": "Operation failed. Try again.",
      aborted: "Operation was cancelled",
      "deadline-exceeded": "Request took too long. Try again.",
      unavailable: "Service is temporarily unavailable",
      unauthenticated: "Please log in first",
    };

    const userFriendlyMessage =
      firestoreErrors[error.code] || "An error occurred. Please try again.";

    this.captureException(error, {
      type: "firestore",
      operation,
      userMessage: userFriendlyMessage,
    });

    return userFriendlyMessage;
  }

  /**
   * Log custom events
   */
  logEvent(eventName: string, properties: Record<string, any> = {}) {
    if (this.isDev) {
      if (import.meta.env.DEV) {
        console.log(`📊 Event: ${eventName}`, properties);
      }
    }
  }

  /**
   * Log performance metrics
   */
  logMetric(metricName: string, value: number, unit: string = "ms") {
    const metric = `${metricName}: ${value}${unit}`;
    if (this.isDev) {
      if (import.meta.env.DEV) {
        console.log(`⚡ Metric: ${metric}`);
      }
    }
  }
}

export const errorLogger = new ErrorLogger();
