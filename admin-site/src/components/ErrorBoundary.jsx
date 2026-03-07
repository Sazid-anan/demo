import { Component } from "react";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { errorLogger } from "../services/errorLogger";
import { getFriendlyMessage, categorizeError } from "../utils/errorTypes";

/**
 * Global Error Boundary
 * Catches JavaScript errors anywhere in the child component tree
 * Provides error recovery, reporting, and user-friendly messaging
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      retryCount: 0,
      isRetrying: false,
      userMessage: "",
      showDetails: import.meta.env.DEV,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    const userMessage = getFriendlyMessage(error);
    const errorCategory = categorizeError(error);

    const loggedError = errorLogger.captureException(error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      category: errorCategory,
    });

    // Update state
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
      userMessage,
      errorId: loggedError.id,
    }));

    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0,
    });
  };

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    // Wait a moment before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState((prevState) => ({
      retryCount: prevState.retryCount + 1,
      isRetrying: false,
    }));
    this.handleReset();
  };

  handleReportError = async () => {
    const { error, errorInfo, errorId } = this.state;
    const report = `
Error ID: ${errorId}
Message: ${error?.message}
URL: ${window.location.href}
Time: ${new Date().toISOString()}

Stack Trace:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(report);
    alert("Error report copied to clipboard. Please email it to support.");

    // Optional: Send to support
    // fetch('/api/report-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ errorId, userMessage: error?.message })
    // }).catch(console.error);
  };

  toggleDetails = () => {
    this.setState((prev) => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, userMessage, showDetails, errorId, isRetrying, retryCount } =
        this.state;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-700 text-center mb-6">{userMessage}</p>

            {/* Error ID */}
            {errorId && (
              <p className="text-sm text-gray-500 text-center mb-6 font-mono bg-gray-100 p-2 rounded">
                Error ID: {errorId}
              </p>
            )}

            {/* Dev Details */}
            {import.meta.env.DEV && error && (
              <details className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <summary
                  className="font-bold cursor-pointer text-gray-900 flex items-center gap-2 hover:text-red-600"
                  onClick={this.toggleDetails}
                >
                  <span>{showDetails ? "Hide" : "Show"} Details</span>
                </summary>
                {showDetails && (
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <strong>Error Message:</strong>
                      <pre className="text-red-700 whitespace-pre-wrap break-words">
                        {error.toString()}
                      </pre>
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="text-red-700 whitespace-pre-wrap break-words overflow-auto max-h-48">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-red-700 whitespace-pre-wrap break-words overflow-auto max-h-48">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button */}
              <button
                onClick={this.handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                <RefreshCw size={18} className={isRetrying ? "animate-spin" : ""} />
                {isRetrying ? "Retrying..." : "Try Again"}
                {retryCount > 0 && ` (${retryCount})`}
              </button>

              {/* Go Home Button */}
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                <Home size={18} />
                Go Home
              </button>

              {/* Report Error Button */}
              <button
                onClick={this.handleReportError}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium transition"
              >
                <Mail size={18} />
                Report Error
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-600 text-center mt-6">
              If this error persists, please{" "}
              <a
                href="mailto:support@danvion.com"
                className="text-blue-600 underline hover:text-blue-700"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
