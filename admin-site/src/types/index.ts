/**
 * Common Type Definitions
 * Shared types across the application
 */

export interface Product {
  id: string;
  name: string;
  category?: string;
  description: string;
  details?: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export interface Blog {
  id: string;
  title: string;
  category?: string;
  content: string;
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
  tags?: string[];
  featured_image?: string;
  [key: string]: any;
}

export interface HomePage {
  headline?: string;
  section_title?: string;
  section2_title?: string;
  section2_text_one?: string;
  section2_text_two?: string;
  hero2_image_url?: string;
  hero2_image_details?: string;
  [key: string]: any;
}

export interface FormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
}

export interface AdminUser {
  email: string;
  isLoggedIn: boolean;
  lastLogin?: Date;
}

export interface NavLink {
  path: string;
  label: string;
  icon?: React.ComponentType<any>;
}

export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  timestamp?: Date;
  severity?: "low" | "medium" | "high" | "critical";
}

export type LoadingState = "idle" | "pending" | "success" | "error";

export interface AsyncState<T> {
  status: LoadingState;
  data?: T;
  error?: string;
  isLoading: boolean;
}
