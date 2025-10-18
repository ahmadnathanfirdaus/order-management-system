import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import multer from "multer";
import seedProducts from "./data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const uploadDir = path.join(publicDir, "uploads");

const cloneSeedProducts = () =>
  seedProducts.map((product) => ({
    ...product,
    images: [...product.images],
    specs: { ...product.specs },
  }));

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

let products = cloneSeedProducts();
let orders = [];

const ensureUploadsDir = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const slugifyCategory = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCategories = () => {
  const map = new Map();
  products.forEach((product) => {
    if (!product.category) return;
    const slug = slugifyCategory(product.category);
    if (!slug || map.has(slug)) return;
    map.set(slug, {
      id: slug,
      name: product.category,
    });
  });
  return Array.from(map.values());
};

const generateOrderId = () => {
  const year = new Date().getFullYear();
  const base = `ORD-${year}-`;
  const numbers = orders
    .map((order) => {
      const parts = order.id.split("-");
      return Number.parseInt(parts[2], 10);
    })
    .filter(Number.isFinite);
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `${base}${String(next).padStart(4, "0")}`;
};

const normalizeNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter(Boolean);
  }
  if (typeof images === "string" && images.trim()) {
    return [images.trim()];
  }
  return [];
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${sanitized}`);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadDir));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    products: products.length,
    orders: orders.length,
  });
});

app.get("/api/products", (req, res) => {
  const searchQuery = String(req.query.search || "").trim().toLowerCase();
  const categoryParam = slugifyCategory(req.query.category);
  const pageParam = Number.parseInt(req.query.page, 10);
  const limitParam = Number.parseInt(req.query.limit, 10);

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 6;

  const filteredByCategory = categoryParam
    ? products.filter(
        (product) => slugifyCategory(product.category) === categoryParam,
      )
    : products;

  const filtered = searchQuery
    ? filteredByCategory.filter((product) => {
        const haystack = `${product.title} ${product.category} ${product.description}`.toLowerCase();
        return haystack.includes(searchQuery);
      })
    : filteredByCategory;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  res.json({
    data,
    meta: {
      page: currentPage,
      limit,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
    },
  });
});

app.get("/api/categories", (_req, res) => {
  res.json({
    data: getCategories(),
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  return res.json(product);
});

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.status(201).json({
    url: fileUrl,
    path: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

app.post("/api/products", (req, res) => {
  const { title, price, category, stock, description, images, specs } = req.body;
  if (!title || !price) {
    return res.status(400).json({ message: "Nama dan harga produk wajib diisi" });
  }

  const newProduct = {
    id: `prod_${String(products.length + 1).padStart(3, "0")}`,
    title,
    price: normalizeNumber(price, 0),
    category: category ?? "Lainnya",
    stock: normalizeNumber(stock, 0),
    description: description ?? "",
    images: normalizeImages(images),
    specs: specs ?? {},
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  const updates = {
    ...req.body,
  };

  if ("price" in updates) {
    updates.price = normalizeNumber(updates.price, products[index].price);
  }

  if ("stock" in updates) {
    updates.stock = normalizeNumber(updates.stock, products[index].stock);
  }

  if ("images" in updates) {
    updates.images = normalizeImages(updates.images);
  }

  const updated = {
    ...products[index],
    ...updates,
  };
  products[index] = updated;
  return res.json(updated);
});

app.get("/api/orders", (_req, res) => {
  const enriched = orders.map((order) => {
    const totalItems = order.items.reduce((acc, item) => acc + item.qty, 0);
    return {
      ...order,
      totalItems,
      formattedSubtotal: formatCurrency(order.subtotal),
    };
  });
  res.json(enriched);
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.find((item) => item.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan" });
  }
  return res.json(order);
});

app.post("/api/orders", (req, res) => {
  const { customer, items } = req.body;

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return res.status(400).json({ message: "Data pelanggan belum lengkap" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Item order belum diisi" });
  }

  const detailedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Produk ${item.productId} tidak ditemukan`);
    }

    return {
      productId: product.id,
      title: product.title,
      price: product.price,
      qty: item.qty,
    };
  });

  const subtotal = detailedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const newOrder = {
    id: generateOrderId(),
    customer,
    items: detailedItems,
    subtotal,
    status: "Baru",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);

  return res.status(201).json(newOrder);
});

app.patch("/api/orders/:id", (req, res) => {
  const index = orders.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Order tidak ditemukan" });
  }

  const allowed = ["status", "customer", "items", "subtotal"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key)),
  );

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return res.json(orders[index]);
});

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

ensureUploadsDir()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Mock backend berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Gagal menyiapkan direktori upload:", error);
    process.exit(1);
  });
