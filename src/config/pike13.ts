const FALLBACK_BASE_URL = "https://jtl.pike13.com";

const pickString = (...values: Array<unknown>): string | undefined => {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return undefined;
};

const readImportMetaEnv = (): Record<string, unknown> | undefined => {
  if (typeof import.meta !== "undefined") {
    const meta = import.meta as { env?: Record<string, unknown> };
    if (meta && typeof meta.env === "object" && meta.env) {
      return meta.env;
    }
  }
  return undefined;
};

const readProcessEnv = (): Record<string, unknown> | undefined => {
  if (typeof process !== "undefined" && typeof process.env === "object") {
    return process.env as Record<string, unknown>;
  }
  return undefined;
};

const readGlobalEnv = (): Record<string, unknown> | undefined => {
  if (typeof globalThis === "object" && globalThis) {
    return globalThis as Record<string, unknown>;
  }
  return undefined;
};

export interface Pike13EnvConfig {
  baseUrl: string | null;
  clientId: string | null;
}

export const getPike13BaseUrl = (): string => {
  const importMetaEnv = readImportMetaEnv();
  const processEnv = readProcessEnv();
  const globalEnv = readGlobalEnv();
  const base = pickString(
    importMetaEnv?.PUBLIC_PIKE13_BASE_URL,
    importMetaEnv?.PIKE13_BASE_URL,
    processEnv?.PUBLIC_PIKE13_BASE_URL,
    processEnv?.PIKE13_BASE_URL,
    globalEnv?.__PIKE13_BASE_URL,
  );
  const resolved = base ?? FALLBACK_BASE_URL;
  return resolved.replace(/\/$/, "");
};

export const getPike13ClientId = (): string | null => {
  const importMetaEnv = readImportMetaEnv();
  const processEnv = readProcessEnv();
  const globalEnv = readGlobalEnv();
  const clientId = pickString(
    importMetaEnv?.PUBLIC_PIKE13_CLIENT_ID,
    importMetaEnv?.PIKE13_CLIENT_ID,
    processEnv?.PUBLIC_PIKE13_CLIENT_ID,
    processEnv?.PIKE13_CLIENT_ID,
    globalEnv?.__PIKE13_CLIENT_ID,
  );
  return clientId ?? null;
};

export const getPike13Config = (): Pike13EnvConfig => ({
  baseUrl: getPike13BaseUrl(),
  clientId: getPike13ClientId(),
});
