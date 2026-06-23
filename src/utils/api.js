const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const request = async (endpoint, options = {}) => {
	const token = localStorage.getItem("token");

	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const config = {
		...options,
		headers,
	};

	if (config.body && typeof config.body === "object") {
		config.body = JSON.stringify(config.body);
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, config);
	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		const errorMessage =
			data.message || data.error || "Something went wrong";
		throw new Error(errorMessage);
	}

	return data;
};

export const api = {
	get: (endpoint, options) =>
		request(endpoint, { ...options, method: "GET" }),
	post: (endpoint, body, options) =>
		request(endpoint, { ...options, method: "POST", body }),
	put: (endpoint, body, options) =>
		request(endpoint, { ...options, method: "PUT", body }),
	delete: (endpoint, options) =>
		request(endpoint, { ...options, method: "DELETE" }),
};
