import { app,writeData } from "../../index.js";
import { readProducts } from "./Products.js";

export function postProduct(){
    app.post("/api/products", (req, res) => {
    try {
      const data = readProducts();

      const {
        name,
        price,
        description,
        category,
        stock,
        sku,
        images,
        tags,
        specifications,
        weight,
      } = req.body;

      // Валидация
      if (!price) {
        return res.status(400).json({
          error: "PRICE",
          message: "Укажите цену товара",
        });
      }

      if (!name) {
        return res
          .status(400)
          .json({ error: "NAME", message: "Напишите название товара" });
      }
      if (!sku) {
        return res.status(400).json({
          error: "SKU",
          message: "Напишите актрикул товара",
        });
      }

      if (!category) {
        return res.status(400).json({
          error: "CATEGORY",
          message: "Category is required",
        });
      }

      const newProduct = {
        id: crypto.randomUUID(),
        name,
        description: description || "",
        price: Number(price),
        category,
        stock: Number(stock) || 0,
        inStock: Boolean(stock),
        rating: 0,
        reviews: 0,
        images: images || [],
        sku,
        date: new Date().toISOString(),
        tags: tags || [],
        specifications: specifications || {},
        weight: weight ? Number(weight) : null,
      };

      data.products.push(newProduct);
      writeData(data);

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("POST Error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });
}