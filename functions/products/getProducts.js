import { readProducts } from "./Products.js";
import { app } from "../../index.js";
export function getProduct() {
  app.get("/api/products", (req, res) => {
    try {
      const { category, minPrice, maxPrice, inStock, sortBy, search, limit } = req.query;
      
      // Исправлено: readProducts() возвращает сам массив
      const allProducts = readProducts(); 
      let products = [...allProducts];

      // Фильтрация по категории
      if (category) {
        // Если в категории приходят ID как числа, используем String для сравнения
        products = products.filter((p) => String(p.categoryId) === String(category) || p.category === category);
      }

      // Фильтрация по цене
      if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

      // Наличие (проверяем и stock > 0, и флаг inStock если он есть)
      if (inStock === "true") {
        products = products.filter((p) => p.stock > 0 || p.inStock === true);
      }

      // Поиск
      if (search) {
        const s = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.tags?.some((tag) => tag.toLowerCase().includes(s))
        );
      }

      // Сортировка
      if (sortBy) {
        switch (sortBy) {
          case "price-asc": products.sort((a, b) => a.price - b.price); break;
          case "price-desc": products.sort((a, b) => b.price - a.price); break;
          case "rating": products.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
          case "newest": products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
        }
      }

      if (limit) products = products.slice(0, Number(limit));

      res.json(products);
    } catch (error) {
      console.error("GET /api/products error:", error);
      res.status(500).json({ error: "Ошибка при получении товаров" });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    try {
      const allProducts = readProducts();
      // Поиск по ID (приводим оба к строке для надежности)
      const product = allProducts.find((p) => String(p.id) === String(req.params.id));

      if (!product) {
        return res.status(404).json({ error: "Товар не найден" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении товара" });
    }
  });
}