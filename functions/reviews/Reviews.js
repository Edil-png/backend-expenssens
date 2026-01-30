import { app, readData } from "../../index.js";
export function Reviews() {
  app.get("/api/products/:productId/reviews", (req, res) => {
    try {
      const data = readData();
      const productId = req.params.productId;

      const productReviews = data.reviews.filter(
        (review) => review.productId === productId,
      );
      res.json(productReviews);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении отзывов" });
    }
  });

  app.post("/api/reviews", (req, res) => {
    try {
      const data = readData();
      const { productId, userId, rating, comment } = req.body;

      // Проверяем существование пользователя и товара
      const user = data.users.find((u) => u.id === userId);
      const product = data.products.find((p) => p.id === productId);

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      if (!product) {
        return res.status(404).json({ error: "Товар не найден" });
      }

      // Проверяем, купил ли пользователь товар
      const hasPurchased = data.orders.some(
        (order) =>
          order.userId === userId &&
          order.items.some((item) => item.productId === productId),
      );

      const review = {
        id: generateId(),
        productId,
        userId,
        userName: user.name,
        rating,
        comment,
        date: new Date().toISOString(),
        verifiedPurchase: hasPurchased,
        helpful: 0,
      };

      data.reviews.push(review);

      // Обновляем рейтинг товара
      const productReviews = data.reviews.filter(
        (r) => r.productId === productId,
      );
      const averageRating =
        productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length;
      product.rating = parseFloat(averageRating.toFixed(1));
      product.reviews = productReviews.length;

      writeData(data);

      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при создании отзыва" });
    }
  });
}
