import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../src/data");

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

let products = [];
let orders = [];

const readJson = async (file) => {
  const filePath = path.join(dataDir, file);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

const writeJson = async (file, data) => {
  const filePath = path.join(dataDir, file);
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, "utf-8");
};

const loadData = async () => {
  products = await readJson("products.json");
  orders = await readJson("orders.json");
};

const persistOrders = async () => {
  await writeJson("orders.json", orders);
};

const persistProducts = async () => {
  await writeJson("products.json", products);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

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

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    products: products.length,
    orders: orders.length,
  });
});

app.get("/api/products", (_req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  return res.json(product);
});

app.post("/api/products", (req, res) => {
  const { title, price, category, stock, description, images, specs } = req.body;
  if (!title || !price) {
    return res.status(400).json({ message: "Nama dan harga produk wajib diisi" });
  }

  const newProduct = {
    id: `prod_${String(products.length + 1).padStart(3, "0")}`,
    title,
    price,
    category: category ?? "Lainnya",
    stock: stock ?? 0,
    description: description ?? "",
    images: images ?? [],
    specs: specs ?? {},
  };

  products.push(newProduct);
  persistProducts().catch((error) => {
    console.error("Gagal menyimpan produk:", error);
  });

  return res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  const updated = {
    ...products[index],
    ...req.body,
  };
  products[index] = updated;
  persistProducts().catch((error) => {
    console.error("Gagal memperbarui produk:", error);
  });
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

  persistOrders().catch((error) => {
    console.error("Gagal menyimpan order:", error);
  });

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

  persistOrders().catch((error) => {
    console.error("Gagal memperbarui order:", error);
  });

  return res.json(orders[index]);
});

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

loadData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Mock backend berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Gagal memuat data awal:", error);
    process.exit(1);
  });
