# Pike13 Support

Review the Pike13 API here: https://developer.pike13.com/docs/api/v2

## Front API Reference

The front (unauthenticated) Pike13 API provides a lightweight way to surface
public information like schedules and service offerings directly on the
website. Base URL for all requests is:

```
https://jtl.pike13.com/api/v2/front
```

Common resources:

- `GET /services` — List public services (classes, camps, lessons). Supports
	filtering via `?type`, `?category_id`, `?per_page`, `?page`.
- `GET /services/{id}` — Public detail for a single service.
- `GET /event_occurrences` — Upcoming scheduled instances across services.
- `GET /event_occurrences/{id}` — Detail for a specific occurrence.
- `GET /staff_members` — Public staff directory entries.

### Request Guidelines

- Always append `.json` when exploring in the browser (e.g.
	`/services.json`).
- Most collection endpoints accept standard pagination (`page`, `per_page`) and
	date range filters (`starts_after`, `starts_before`). Time parameters expect
	ISO 8601 strings.
- When querying occurrences, combine `service_ids[]` or `location_ids[]` with
	`starts_after`/`starts_before` to scope the results.
- The front API is read-only. Any POST/PUT/DELETE calls require an authenticated
	access token and are not available here.

### Error Handling

- 401/403 indicates the endpoint requires authentication; look for a front
	alternative in the docs.
- 404 typically means the resource is private or the ID is incorrect.
- Rate limiting is minimal, but cache responses where possible to avoid repeat
	calls during page renders.

### Example Calls

```http
GET https://jtl.pike13.com/api/v2/front/services.json
GET https://jtl.pike13.com/api/v2/front/services.json?category_id=42&per_page=50
GET https://jtl.pike13.com/api/v2/front/event_occurrences.json?service_ids[]=12345&starts_after=2025-11-01T00:00:00Z
```

### Development Notes

- Prefer server-side fetching with caching to keep the public API within rate
	limits.
- Normalize Pike13 responses into internal data structures before rendering to
	simplify component consumption.
- Sanitize any HTML returned in descriptions — most fields are plain text, but
	validate before injecting into templates.
