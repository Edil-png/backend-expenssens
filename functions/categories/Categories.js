import { fileURLToPath } from "url";
import { getCategories } from "./getCategories.js";
import fs from "fs";
import path from "path";
import { readProducts } from "../products/Products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesPath = path.join(__dirname, "../../data/categories.json");

export function readCategories() {
  try {
    // 1. Проверяем наличие файла
    if (!fs.existsSync(categoriesPath)) {
      const dir = path.dirname(categoriesPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(categoriesPath, JSON.stringify([], null, 2));
      return [];
    }

    // 2. Читаем данные
    const data = fs.readFileSync(categoriesPath, "utf-8");
    const categories = JSON.parse(data || "[]");

    // 3. (Опционально) Добавляем счетчик товаров для фронтенда
    const products = readProducts();
    return categories.map(cat => ({
      ...cat,
      count: products.filter(p => p.category === cat.slug || p.categoryId === cat.id).length
    }));

  } catch (error) {
    console.error("Ошибка при чтении категорий:", error);
    return [];
  }
}

// Добавляем функцию записи, чтобы работали POST/PUT/DELETE
export function writeCategories(data) {
  fs.writeFileSync(categoriesPath, JSON.stringify(data, null, 2));
}

export function Categories() {
  getCategories(); // Здесь регистрируются роуты (app.get и т.д.)
}