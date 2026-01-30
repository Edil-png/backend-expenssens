import { app, generateId } from "../../index.js";
import { readUsers, writeUsers } from "./Users.js";

export function postUsers() {
  // --- РЕГИСТРАЦИЯ ---
  app.post("/api/users/register", async (req, res) => {
    try {
      const data = readUsers(); // Ожидается объект { users: [], cartItems: {} }
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email и пароль обязательны" });
      }

      const existingUser = data.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: "Пользователь с таким email уже существует" });
      }

      const user = {
        id: generateId(),
        email,
        password, // В продакшене: await bcrypt.hash(password, 10)
        name: name || "Покупатель",
        avatar: "",
        phone: "",
        addresses: [],
        paymentMethods: [],
        wishlist: [],
        recentlyViewed: [],
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          newsletter: true,
          marketingEmails: false,
          language: "ru",
          currency: "RUB",
        },
        role: "customer",
        isAdmin: false, // По умолчанию не админ
        ordersCount: 0,
        totalSpent: 0,
      };

      data.push(user);
      
      // Проверка на наличие объекта cartItems в базе данных
      if (!data) data = {};
      
      
      writeUsers(data);

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Ошибка при регистрации" });
    }
  });

  // --- ЛОГИН ---
  app.post("/api/users/login", (req, res) => {
    try {
      const data = readUsers(); // Это объект { users: [...] }
      const { email, password } = req.body;

      // Ищем именно в массиве users внутри объекта data
      const user = data.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return res.status(401).json({ error: "Неверный email или пароль" });
      }

      // Обновляем время входа
      user.lastLogin = new Date().toISOString();
      writeUsers(data);

      const { password: _, ...userWithoutPassword } = user;
      const token = `token_${generateId()}_${user.id}`;

      res.json({
        user: userWithoutPassword,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Ошибка при входе" });
    }
  });
}