export interface Pike13ClientOptions {
  baseUrl: string;
  clientId?: string | null;
  defaultHeaders?: Record<string, string>;
  services?: Array<number | string | null>;
}

export interface Pike13FetchOptions {
  params?: Record<string, unknown>;
  method?: string;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  includeClientId?: boolean;
  signal?: AbortSignal;
  parseJson?: boolean;
}

export interface Pike13FetchResult<T = unknown> {
  ok: boolean;
  status: number;
  url: string;
  data: T | null;
  raw: string;
}

export interface Pike13FetchPagesOptions extends Pike13FetchOptions {
  perPageParam?: string;
  pageParam?: string;
  perPage?: number;
  maxPages?: number;
  dataKey?: string;
}

export interface Pike13FetchPagesResult<T = unknown> {
  ok: boolean;
  status: number;
  url: string;
  items: T[];
  pages: Pike13FetchResult[];
}

export interface Pike13GetEventsParams {
  service_id?: number | string | null;
  service_ids?: Array<number | string | null>;
  event_ids?: Array<number | string | null>;
  start_at?: string | Date | null;
  end_at?: string | Date | null;
  starts_after?: string | Date | null;
  starts_before?: string | Date | null;
  updated_at?: string | Date | null;
  state?: string | null;
  per_page?: number | null;
  page?: number | null;
  includeClientId?: boolean;
  allPages?: boolean;
  maxPages?: number;
  [key: string]: unknown;
}

export interface Pike13GetServiceParams {
  serviceId: number | string;
  include?: string | null;
  fields?: string | null;
  includeClientId?: boolean;
  [key: string]: unknown;
}

export interface Pike13GetOccurrancesParams {
  service_id?: number | string | null;
  service_ids?: Array<number | string | null>;
  starts_after?: string | Date | null;
  starts_before?: string | Date | null;
  per_page?: number | null;
  page?: number | null;
  include?: string | null;
  includeClientId?: boolean;
  allPages?: boolean;
  maxPages?: number;
  [key: string]: unknown;
}

export class Pike13Client {
  private readonly baseUrl: string;
  private readonly clientId: string | null;
  private readonly defaultHeaders: Record<string, string>;
  private serviceIds: number[];

  constructor(options: Pike13ClientOptions) {
    const baseUrl = options?.baseUrl?.trim() ?? "";
    if (!baseUrl) {
      throw new Error("Pike13Client requires a baseUrl");
    }

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.clientId = options?.clientId?.trim() ? options.clientId.trim() : null;
    this.defaultHeaders = {
      Accept: "application/json",
      ...options?.defaultHeaders,
    };
    this.serviceIds = this.normalizeIds(options?.services ?? []);
  }

  setServices(values: Array<number | string | null | undefined>): void {
    this.serviceIds = this.normalizeIds(values ?? []);
  }

  getServices(): number[] {
    return [...this.serviceIds];
  }

  async fetch<T = unknown>(path: string, options: Pike13FetchOptions = {}): Promise<Pike13FetchResult<T>> {
    const url = this.buildUrl(path, options.params ?? {}, options.includeClientId ?? true);
    const method = options.method ?? "GET";
    const headers = { ...this.defaultHeaders, ...(options.headers ?? {}) };
    const init: RequestInit = {
      method,
      headers,
      body: options.body ?? null,
      signal: options.signal,
    };

    if (method.toUpperCase() === "GET") {
      delete init.body;
    }

    const response = await fetch(url, init);
    const raw = await response.text();
    let data: T | null = null;

    if (options.parseJson !== false) {
      try {
        data = raw ? (JSON.parse(raw) as T) : (null as T | null);
      } catch (_error) {
        data = null;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      url,
      data,
      raw,
    };
  }

  async fetchPages<T = unknown>(path: string, options: Pike13FetchPagesOptions = {}): Promise<Pike13FetchPagesResult<T>> {
    const perPageParam = options.perPageParam ?? "per_page";
    const pageParam = options.pageParam ?? "page";
    const perPage = options.perPage ?? 100;
    const maxPages = options.maxPages ?? 10;
    const params = { ...(options.params ?? {}) };
    const pages: Pike13FetchResult[] = [];
    const items: T[] = [];

    for (let page = 1; page <= maxPages; page += 1) {
      params[perPageParam] = params[perPageParam] ?? perPage;
      params[pageParam] = page;

      const result = await this.fetch(path, {
        ...options,
        params,
      });

      pages.push(result);

      if (!result.ok || !result.data) {
        break;
      }

      const extracted = this.extractData<T>(result.data, options.dataKey);
      if (extracted.length > 0) {
        items.push(...extracted);
      }

      const received = extracted.length;
      const requestedPerPage = Number(params[perPageParam]) || perPage;
      if (received < requestedPerPage) {
        break;
      }
    }

    const last = pages[pages.length - 1];
    return {
      ok: Boolean(last?.ok),
      status: last?.status ?? 0,
      url: last?.url ?? this.buildUrl(path, params, options.includeClientId ?? true),
      items,
      pages,
    };
  }

  async getEvents(params: Pike13GetEventsParams = {}): Promise<Pike13FetchPagesResult | Pike13FetchResult> {
    const { allPages = true, includeClientId = true, maxPages } = params;
    const query = { ...params };
    delete query.allPages;
    delete query.includeClientId;
    delete query.maxPages;

    this.applyDefaultServices(query, "service_ids", "service_id");

    if (allPages) {
      return this.fetchPages("/api/v2/front/events.json", {
        params: query,
        includeClientId,
        maxPages,
        dataKey: "events",
      });
    }

    return this.fetch("/api/v2/front/events.json", {
      params: query,
      includeClientId,
    });
  }

  async getService(params: Pike13GetServiceParams): Promise<Pike13FetchResult> {
    const { serviceId, includeClientId = true, ...rest } = params;
    const id = this.normalizeId(serviceId);
    if (id === null) {
      throw new Error("getService requires a valid serviceId");
    }

    return this.fetch(`/api/v2/front/services/${id}.json`, {
      params: rest,
      includeClientId,
    });
  }

  async getOccurrances(params: Pike13GetOccurrancesParams = {}): Promise<Pike13FetchPagesResult | Pike13FetchResult> {
    const { allPages = true, includeClientId = true, maxPages } = params;
    const query = { ...params };
    delete query.allPages;
    delete query.includeClientId;
    delete query.maxPages;

    this.applyDefaultServices(query, "service_ids", "service_id");

    if (allPages) {
      return this.fetchPages("/api/v2/front/event_occurrences.json", {
        params: query,
        includeClientId,
        maxPages,
        dataKey: "event_occurrences",
      });
    }

    return this.fetch("/api/v2/front/event_occurrences.json", {
      params: query,
      includeClientId,
    });
  }

  private normalizeIds(values: Array<number | string | null | undefined>): number[] {
    return Array.from(
      new Set(
        values
          .map((value) => this.normalizeId(value))
          .filter((value): value is number => value !== null && Number.isFinite(value)),
      ),
    ).sort((a, b) => a - b);
  }

  private normalizeId(value: number | string | null | undefined): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.trunc(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const parsed = Number.parseInt(trimmed, 10);
      return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
    }
    return null;
  }

  private buildUrl(path: string, params: Record<string, unknown>, includeClientId: boolean): string {
    const url = new URL(path, this.baseUrl);
    const search = url.searchParams;

    if (includeClientId && this.clientId && !search.has("client_id")) {
      search.set("client_id", this.clientId);
    }

    Object.entries(params ?? {}).forEach(([key, value]) => {
      this.appendParam(search, key, value);
    });

    return url.toString();
  }

  private appendParam(search: URLSearchParams, key: string, value: unknown): void {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        this.appendParam(search, key.endsWith("[]") ? key : `${key}[]`, entry);
      });
      return;
    }

    if (value instanceof Date) {
      search.append(key, value.toISOString());
      return;
    }

    if (typeof value === "object") {
      search.append(key, JSON.stringify(value));
      return;
    }

    const stringValue = String(value);
    if (stringValue.length === 0) {
      return;
    }

    search.append(key, stringValue);
  }

  private applyDefaultServices(target: Record<string, unknown>, arrayKey: string, singleKey: string): void {
    if (target[arrayKey] || target[singleKey]) {
      return;
    }

    if (this.serviceIds.length === 0) {
      return;
    }

    target[arrayKey] = [...this.serviceIds];
  }

  private extractData<T>(payload: unknown, dataKey?: string): T[] {
    if (!payload) {
      return [];
    }

    if (!dataKey) {
      if (Array.isArray(payload)) {
        return payload as T[];
      }
      return [];
    }

    if (typeof payload === "object" && dataKey in payload) {
      const value = (payload as Record<string, unknown>)[dataKey];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }

    if (typeof payload === "object") {
      const value = (payload as Record<string, unknown>).data;
      if (Array.isArray(value)) {
        return value as T[];
      }
    }

    return [];
  }
}
