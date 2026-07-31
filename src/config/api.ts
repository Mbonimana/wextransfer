/**
 * Resolves the backend base URL dynamically from environment variables.
 * Type-casted with 'as any' to bypass compiler restrictions on 'import.meta.env'.
 */
export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || 
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) || 
  'http://localhost:4000/api/v1';