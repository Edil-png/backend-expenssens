import { app } from "../../index.js";
import { readStats } from "./Stats.js";

export function getStats() {
  // Путь должен начинаться со слэша "/"
  app.get("/api/stats", (req, res) => {
    try {

      const data = readStats();

      const stats = Array.isArray(data) ? data : data.stats || [];
   

      res.json(stats);
    } catch (error) {
      console.error("Ошибка при получении статистики:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  });
}
