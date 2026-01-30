import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Categories } from "./functions/categories/Categories.js";
import { Users } from "./functions/users/Users.js";
import { Cart } from "./functions/cart/Cart.js";
import { Stats } from "./functions/stats/Stats.js";
import { Reviews } from "./functions/reviews/Reviews.js";
import { promoCodes } from "./functions/promo-codes/promoCodes.js";
import { Products } from "./functions/products/Products.js";
import { Orders } from "./functions/orders/Orders.js";

// --- __dirname для ES Modules ---
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// --- путь к JSON файлам ---
const dataPath = path.join(__dirname, "data", "data.json");

export const app = express();

app.use(cors());
app.use(express.json());

// --- utils ---
export function readData() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });

    const initialData = {
     
     
      
   
      reviews: [],
      shippingMethods: [],
      promoCodes: [],
      cartItems: {},
    };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}


export function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Генератор ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// --- Middleware для логирования ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// --- Basic Routes ---
app.get("/", (req, res) => {
  res.json({
    message: "🛒 E-commerce API работает!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      users: "/api/users",
      orders: "/api/orders",
      reviews: "/api/reviews",
      cart: "/api/users/:userId/cart",
      promoCodes: "/api/promocodes",
    },
  });
});

// Запрос Продуктов
Products();

Categories();

Orders();

Stats()

Users();

Cart();

Reviews();


promoCodes();

Stats();

// --- ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📊 API готов к работе!`);
});
