/**
 * Pike13 configuration that works both server-side and client-side.
 * 
 * Server-side: Uses process.env
 * Client-side: Uses import.meta.env (Astro injects PUBLIC_ prefixed env vars)
 */

export function getPike13BaseUrl(): string {
  // Try client-side first (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PUBLIC_PIKE13_BASE_URL || 'https://jtl.pike13.com';
  }
  
  // Fallback to server-side (process.env)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PUBLIC_PIKE13_BASE_URL || 'https://jtl.pike13.com';
  }
  
  // Global fallback (in case running in different context)
  if (typeof globalThis !== 'undefined' && (globalThis as any).PIKE13_BASE_URL) {
    return (globalThis as any).PIKE13_BASE_URL;
  }
  
  return 'https://jtl.pike13.com';
}

export function getPike13ClientId(): string {
  // Try client-side first (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PUBLIC_PIKE13_CLIENT_ID || 'NO_CLIENT_ID_SET';
  }
  
  // Fallback to server-side (process.env)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PIKE13_CLIENT_ID || 'NO_CLIENT_ID_SET';
  }
  
  // Global fallback
  if (typeof globalThis !== 'undefined' && (globalThis as any).PIKE13_CLIENT_ID) {
    return (globalThis as any).PIKE13_CLIENT_ID;
  }
  
  return 'NO_CLIENT_ID_SET';
}

export interface Pike13Config {
  baseUrl: string;
  clientId: string;
}

export function getPike13Config(): Pike13Config {
  return {
    baseUrl: getPike13BaseUrl(),
    clientId: getPike13ClientId(),
  };
}

