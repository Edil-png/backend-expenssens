import { app } from "../../index.js";
import { readOrders } from "./Orders.js";

export function getOrders() {
  app.get("/api/orders", (req, res) => {
    try {
      const data = readOrders();
      const orders = Array.isArray(data) ? data : (data.orders || []);
      
      res.json(orders);
    } catch (error) {
      console.error("Ошибка при получении заказов:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  });
}