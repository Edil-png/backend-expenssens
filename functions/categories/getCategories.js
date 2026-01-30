import { app } from "../../index.js";
import { readCategories } from "./Categories.js";

export function getCategories() {
  
  app.get("/api/categories", (req, res) => {
    try {
      const categories = readCategories(); 
      res.json(categories); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка при получении категорий" });
    }
  });


  app.get("/api/categories/:id", (req, res) => {
    try {
      const categories = readCategories();
      const category = categories.find((c) => String(c.id) === String(req.params.id));

      if (!category) {
        return res.status(404).json({ error: "Категория не найдена" });
      }

      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка при получении категории" });
    }
  });
}