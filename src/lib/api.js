const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const { body, headers, ...rest } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestInit = {
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    ...rest,
  };

  if (body !== undefined) {
    requestInit.body =
      isFormData || typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, requestInit);

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
  getProducts: (params) => request(`/api/products${buildQueryString(params)}`),
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
  uploadImage: (formData) =>
    request("/api/uploads", { method: "POST", body: formData }),
  getCategories: () => request("/api/categories"),
};
