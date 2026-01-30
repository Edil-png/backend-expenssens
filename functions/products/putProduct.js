import { app  } from "../../index.js";
import { readProducts } from "./Products.js";

export function putProduct() {
  app.put("/api/products/:id", (req, res) => {
    try {
      const data = readProducts();
      const index = data.products.findIndex((p) => p.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Товар не найден" });
      }

      data.products[index] = { ...data.products[index], ...req.body };
      writeData(data);

      res.json(data.products[index]);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при обновлении товара" });
    }
  });
}
