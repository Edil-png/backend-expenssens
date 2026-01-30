import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getOrders } from "./getOrders.js";
import { app } from "../../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const orderPath = path.join(__dirname, "../../data/orders.json");

export function readOrders() {
  try {
    if (!fs.existsSync(orderPath)) {
      const dir = path.dirname(orderPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initialData = [];
      fs.writeFileSync(orderPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const fileContent = fs.readFileSync(orderPath, "utf-8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    console.error("Ошибка при чтении заказов:", error);
    return [];
  }
}

export function writeOrders(data) {
  try {
    fs.writeFileSync(orderPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Ошибка при записи заказов:", error);
  }
}

export function Orders() {
  getOrders();
}
