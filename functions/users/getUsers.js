import { app } from "../../index.js";
import { readUsers } from "./Users.js";

export function getUsers() {
  app.get("/api/users", (req, res) => {
    try {
      const data = readUsers();


      // 1. Проверяем, что данные вообще есть
      if (!data || !Array.isArray(data)) {
        return res
          .status(500)
          .json({ error: "База данных пользователей недоступна" });
      }

      // 2. Безопасное создание списка без паролей
      const usersWithoutPasswords = data.map(
        ({ password, ...user }) => user,
      );
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении пользователей" });
    }
  });
  app.get("/api/users/:id", (req, res) => {
    try {
      const data = readUsers();
      const user = data.users.find((u) => u.id === req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      // Удаляем пароль из ответа
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении пользователя" });
    }
  });
}
