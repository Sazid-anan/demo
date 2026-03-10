/**
 * Danvion Admin - API Client
 *
 * Fetch wrapper with JWT authentication for PHP REST API
 */

// API base URL from environment variable.
// In local dev, default to same-origin /api and let Vite proxy forward requests.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://danvion.com/api");
const TOKEN_STORAGE_KEY = "danvion_admin_token";

// Module-level token storage, initialized from sessionStorage for refresh persistence.
let authToken = null;

if (typeof window !== "undefined") {
  try {
    authToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    authToken = null;
  }
}

/**
 * Set JWT token (called after login)
 */
export const setToken = (token) => {
  authToken = token;

  if (typeof window !== "undefined") {
    try {
      if (token) {
        window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage write failures and keep in-memory token.
    }
  }
};

/**
 * Get current token
 */
export const getToken = () => {
  return authToken;
};

/**
 * Clear token (called on logout)
 */
export const clearToken = () => {
  authToken = null;

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
  }
};

/**
 * Generic fetch wrapper with token handling
 */
const apiFetch = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    const raw = await response.text();
    let data = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }
    }

    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      clearToken();
      // Dispatch logout action if needed
      if (window.__store) {
        const { logoutAdmin } = await import("../redux/slices/authSlice");
        window.__store.dispatch(logoutAdmin());
      }
      throw new Error("Unauthorized. Please login again.");
    }

    if (!response.ok) {
      const fallbackMessage = raw
        ? raw.slice(0, 180)
        : `Server returned status ${response.status} with an empty response body`;
      throw new Error(
        data?.message || `HTTP Error ${response.status}: ${fallbackMessage}`,
      );
    }

    // Keep API contract stable for existing callers.
    return (
      data ?? { success: false, message: "Invalid JSON response from API" }
    );
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = async (url) => {
  return apiFetch(url, {
    method: "GET",
  });
};

/**
 * POST request
 */
export const post = async (url, data) => {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const put = async (url, data) => {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const del = async (url) => {
  return apiFetch(url, {
    method: "DELETE",
  });
};

/**
 * Upload file (multipart/form-data)
 */
export const upload = async (url, formData) => {
  const headers = {};

  // Add Authorization header if token exists
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers,
      body: formData, // Don't set Content-Type for FormData
    });

    const data = await response.json();

    if (response.status === 401) {
      clearToken();
      throw new Error("Unauthorized. Please login again.");
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

export const apiClient = {
  get,
  post,
  put,
  del,
  upload,
  setToken,
  getToken,
  clearToken,
  API_URL,
};

export default apiClient;
