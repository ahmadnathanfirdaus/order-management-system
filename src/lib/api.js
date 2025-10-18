const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
    body:
      options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || "Terjadi kesalahan pada server");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const api = {
  getProducts: () => request("/api/products"),
  getProduct: (id) => request(`/api/products/${id}`),
  createProduct: (product) =>
    request("/api/products", { method: "POST", body: product }),
  updateProduct: (id, product) =>
    request(`/api/products/${id}`, { method: "PUT", body: product }),
  getOrders: () => request("/api/orders"),
  getOrder: (id) => request(`/api/orders/${id}`),
  createOrder: (order) => request("/api/orders", { method: "POST", body: order }),
  updateOrder: (id, updates) =>
    request(`/api/orders/${id}`, { method: "PATCH", body: updates }),
  healthCheck: () => request("/api/health"),
};
