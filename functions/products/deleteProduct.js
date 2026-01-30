import { app } from "../../index.js";
import { readProducts,writeProducts } from "./Products.js";

// Пример логики в deleteProduct.js
export function deleteProduct() {
  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    let products = readProducts()
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    writeProducts(products);
    res.status(200).json({ message: "Удалено успешно" });
  });
}