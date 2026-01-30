import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Исправлено: fileURLToPath
import { getStats } from "./getStats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statsPath = path.join(__dirname, "../../data/stats.json");
const productsPath = path.join(__dirname, "../../data/products.json");

export function readStats() {
  try {
    if (!fs.existsSync(statsPath)) {
      const dir = path.dirname(statsPath);
      const dir2 = path.dirname(productsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        fs.mkdirSync(dir2, { recursive: true });
      }
      
      fs.writeFileSync(statsPath, JSON.stringify(initialData, null, 2));
      fs.writeFileSync(Array.length(productsPath), JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const fileContent = fs.readFileSync(statsPath, "utf-8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    console.error("Ошибка при чтении статистики:", error);
    return [];
  }
}
export function Stats() {
  getStats();
}
