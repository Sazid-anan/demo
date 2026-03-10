/**
 * Danvion Main - API Client
 *
 * Fetch wrapper for PHP REST API.
 */

const API_URL = import.meta.env.VITE_API_URL || "https://danvion.com/api";

const apiFetch = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return data;
};

export const get = async (url) => {
  return apiFetch(url, { method: "GET" });
};

export const post = async (url, data) => {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const put = async (url, data) => {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const del = async (url) => {
  return apiFetch(url, { method: "DELETE" });
};

export const upload = async (url, formData) => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return data;
};

export default {
  get,
  post,
  put,
  del,
  upload,
  API_URL,
};
