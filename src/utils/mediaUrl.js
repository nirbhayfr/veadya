const LOCAL_ASSET_HOSTS = new Set(["localhost:5173", "127.0.0.1:5173"]);

export const resolveMediaUrl = (value) => {
	if (!value || typeof value !== "string") return value;

	try {
		const parsed = new URL(value, window.location.origin);
		if (LOCAL_ASSET_HOSTS.has(parsed.host)) {
			return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
		}
		return value.startsWith("/") ? `${window.location.origin}${value}` : value;
	} catch {
		return value;
	}
};

export const withImageFallback = (fallback = "/p-1.png") => (event) => {
	if (event.currentTarget.dataset.fallbackApplied) return;
	event.currentTarget.dataset.fallbackApplied = "true";
	event.currentTarget.src = resolveMediaUrl(fallback);
};
