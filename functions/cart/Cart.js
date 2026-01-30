import { app, readData } from "./../../index.js";
export function Cart() {
  app.get("/api/users/:userId/cart", (req, res) => {
    try {
      const data = readData();
      const userId = req.params.userId;

      if (!data.cartItems[userId]) {
        data.cartItems[userId] = [];
        writeData(data);
      }

      res.json(data.cartItems[userId]);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении корзины" });
    }
  });

  app.post("/api/users/:userId/cart", (req, res) => {
    try {
      const data = readData();
      const userId = req.params.userId;
      const { productId, quantity = 1 } = req.body;

      // Проверяем существование пользователя
      const user = data.users.find((u) => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      // Проверяем существование товара
      const product = data.products.find((p) => p.id === productId);
      if (!product) {
        return res.status(404).json({ error: "Товар не найден" });
      }

      if (!data.cartItems[userId]) {
        data.cartItems[userId] = [];
      }

      const existingItemIndex = data.cartItems[userId].findIndex(
        (item) => item.productId === productId,
      );

      if (existingItemIndex > -1) {
        // Обновляем количество существующего товара
        data.cartItems[userId][existingItemIndex].quantity += quantity;
      } else {
        // Добавляем новый товар
        const cartItem = {
          id: generateId(),
          productId,
          name: product.name,
          price: product.price,
          quantity,
          category: product.category,
          image: product.images?.[0],
          maxStock: product.inStock ? 100 : 0,
        };
        data.cartItems[userId].push(cartItem);
      }

      writeData(data);
      res.status(201).json(data.cartItems[userId]);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при добавлении в корзину" });
    }
  });

  app.put("/api/users/:userId/cart/:itemId", (req, res) => {
    try {
      const data = readData();
      const { userId, itemId } = req.params;
      const { quantity } = req.body;

      if (!data.cartItems[userId]) {
        return res.status(404).json({ error: "Корзина не найдена" });
      }

      const itemIndex = data.cartItems[userId].findIndex(
        (item) => item.id === itemId,
      );

      if (itemIndex === -1) {
        return res.status(404).json({ error: "Товар в корзине не найден" });
      }

      if (quantity <= 0) {
        // Удаляем товар, если количество 0 или меньше
        data.cartItems[userId].splice(itemIndex, 1);
      } else {
        data.cartItems[userId][itemIndex].quantity = quantity;
      }

      writeData(data);
      res.json(data.cartItems[userId]);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при обновлении корзины" });
    }
  });

  app.delete("/api/users/:userId/cart/:itemId", (req, res) => {
    try {
      const data = readData();
      const { userId, itemId } = req.params;

      if (!data.cartItems[userId]) {
        return res.status(404).json({ error: "Корзина не найдена" });
      }

      const initialLength = data.cartItems[userId].length;
      data.cartItems[userId] = data.cartItems[userId].filter(
        (item) => item.id !== itemId,
      );

      if (data.cartItems[userId].length === initialLength) {
        return res.status(404).json({ error: "Товар в корзине не найден" });
      }

      writeData(data);
      res.json({ message: "Товар удален из корзины" });
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении из корзины" });
    }
  });
}
