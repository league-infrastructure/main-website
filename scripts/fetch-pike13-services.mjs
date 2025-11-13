import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.resolve(__dirname, "../src/content/config.ts");
const DATA_DIR = path.resolve(__dirname, "../src/data");
const ENV_PATH = path.resolve(__dirname, "../.env");
const FRONT_ENDPOINTS = [
	"/api/v2/front/services.json",
	"/api/v2/front/services",
];
const USER_AGENT = "LeagueWebsite/1.0 (+https://www.jointheleague.org)";

function slugifyCategoryName(name) {
	if (!name || typeof name !== "string") {
		return null;
	}

	const normalized = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");

	return normalized || null;
}

let envLoaded = false;

async function ensureEnvLoaded() {
	if (envLoaded || !existsSync(ENV_PATH)) {
		envLoaded = true;
		return;
	}

	const contents = await readFile(ENV_PATH, "utf8");
	for (const rawLine of contents.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) {
			continue;
		}

		const separatorIndex = line.indexOf("=");
		if (separatorIndex === -1) {
			continue;
		}

		const key = line.slice(0, separatorIndex).trim();
		if (!key) {
			continue;
		}

		let value = line.slice(separatorIndex + 1).trim();
		if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
			value = value.slice(1, -1);
		}

		if (!(key in process.env)) {
			process.env[key] = value;
		}
	}

	envLoaded = true;
}

async function readBaseUrl() {
	const configContents = await readFile(CONFIG_PATH, "utf8");
	const match = configContents.match(/pike13_base_url\s*=\s*["']([^"']+)["']/);
	if (!match) {
		throw new Error("Unable to locate pike13_base_url in config.ts");
	}

	return match[1].replace(/\/$/, "");
}

async function readClientId() {
	await ensureEnvLoaded();
	const envKeys = ["PIKE13_CLIENT_ID", "PIKE13_APPLICATION_ID", "PIKE13_APP_ID"];
	for (const key of envKeys) {
		const value = process.env[key];
		if (value && value.trim()) {
			return value.trim();
		}
	}

	const configContents = await readFile(CONFIG_PATH, "utf8");
	const match = configContents.match(/pike13_client_id\s*=\s*["']([^"']*)["']/);
	if (match && match[1].trim()) {
		return match[1].trim();
	}

	return null;
}

async function fetchServices(baseUrl, clientId) {
	const failures = [];

	for (const endpointSuffix of FRONT_ENDPOINTS) {
		const endpointUrl = new URL(endpointSuffix, baseUrl);
		if (clientId) {
			endpointUrl.searchParams.set("client_id", clientId);
		}

		try {
			const response = await fetch(endpointUrl, {
				headers: {
					Accept: "application/json",
					"User-Agent": USER_AGENT,
				},
			});

			if (!response.ok) {
				const errorBody = await response.text();
				throw new Error(
					`${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ""}`
				);
			}

			const bodyText = await response.text();
			try {
				return JSON.parse(bodyText);
			} catch (parseError) {
				throw new Error("Unexpected response payload while parsing JSON");
			}
		} catch (error) {
			failures.push({
				endpoint: endpointUrl.pathname,
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	if (failures.length === 0) {
		throw new Error("No Pike13 endpoints were attempted. Check script configuration.");
	}

	const detail = failures.map((entry) => `  • ${entry.endpoint}: ${entry.message}`).join("\n");
	throw new Error(`Failed to fetch Pike13 services via available endpoints:\n${detail}`);
}

function simplifyServices(payload) {
	const services = Array.isArray(payload?.services)
		? payload.services
		: Array.isArray(payload)
		? payload
		: [];

	return services.map((service) => {
			const priceString =
				service?.pricing?.single_visit?.base_price?.price_string ??
				service?.pricing?.single_visit?.price_string ??
				service?.pricing?.merchandise_price?.base_price?.price_string ??
				service?.pricing?.merchandise_price?.price_string ??
				service?.pricing?.base_price?.price_string ??
				service?.pricing?.price_string ??
				null;

		const categoryName = service?.category_name ?? null;
		const categorySlug = slugifyCategoryName(categoryName) ?? "uncategorized";

		return {
			id: service?.id ?? null,
			name: service?.name ?? null,
			type: service?.type ?? null,
			description: service?.description ?? null,
			description_short: service?.description_short ?? null,
			instructions: service?.instructions ?? null,
			category_name: categoryName,
			category_id: service?.category_id ?? null,
			category_slug: categorySlug,
			price_string: priceString,
		};
	});
}

async function writeServices(data) {
	await mkdir(DATA_DIR, { recursive: true });

	const simplified = simplifyServices(data);
	const grouped = new Map();

	for (const service of simplified) {
		const slug = service.category_slug ?? "uncategorized";
		if (!grouped.has(slug)) {
			grouped.set(slug, []);
		}
		grouped.get(slug).push(service);
	}

	const targetFiles = new Set();
	const sortedSlugs = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

	for (const slug of sortedSlugs) {
		const fileName = `p13s-${slug}.json`;
		const filePath = path.join(DATA_DIR, fileName);
		targetFiles.add(fileName);
		const payload = JSON.stringify({ services: grouped.get(slug) }, null, 2);
		await writeFile(filePath, `${payload}\n`, "utf8");
	}

	const aggregatePath = path.join(DATA_DIR, "pike13Services.json");
	if (existsSync(aggregatePath)) {
		await rm(aggregatePath, { force: true });
	}

	const existingEntries = await readdir(DATA_DIR);
	await Promise.all(
		existingEntries
			.filter((name) => name.startsWith("p13s-") && name.endsWith(".json") && !targetFiles.has(name))
			.map((name) => rm(path.join(DATA_DIR, name), { force: true }))
	);

	return Array.from(targetFiles).sort((a, b) => a.localeCompare(b));
}

async function main() {
	try {
		const baseUrl = await readBaseUrl();
		const clientId = await readClientId();

		if (!clientId) {
			throw new Error(
				"Pike13 client ID is required. Set PIKE13_CLIENT_ID in your environment or define pike13_client_id in src/content/config.ts."
			);
		}

		const services = await fetchServices(baseUrl, clientId);
		const files = await writeServices(services);
		console.log(
			`Saved Pike13 services to ${files.length} files in ${path.relative(process.cwd(), DATA_DIR)}: ${files.join(", ")}`
		);
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}

void main();
