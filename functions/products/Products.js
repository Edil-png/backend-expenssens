import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { getProduct } from "./getProducts.js";
import { putProduct } from "./putProduct.js";
import { deleteProduct } from "./deleteProduct.js";
import { postProduct } from "./postProduct.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Путь к файлу
const productsPath = path.join(_dirname, "../../data/products.json");

export function readProducts() {
  try {
    if (!fs.existsSync(productsPath)) {
      // Если файла нет, создаем пустой массив (соответствует вашему формату)
      const initialData = [];
      const dir = path.dirname(productsPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(productsPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const data = fs.readFileSync(productsPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Ошибка при чтении продуктов:", error);
    return [];
  }
}

export function writeProducts(data) {
  fs.writeFileSync(productsPath, JSON.stringify(data));
}
export function Products() {
  deleteProduct();
  getProduct();
  putProduct();
  postProduct();
}
