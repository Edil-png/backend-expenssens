import { app } from "../../index.js";
import { readUsers, writeUsers } from "./Users.js";

export function deleteUser() {
  app.delete("/api/users/:id", (req, res) => {
    try {
      let data = readUsers();

      let usersList = Array.isArray(data) ? data : data.users;

      if (!usersList) {
        return res
          .status(500)
          .json({ error: "Данные пользователей не найдены" });
      }

      const initialLength = usersList.length;

      // Фильтруем
      const filteredUsers = usersList.filter(
        (u) => String(u.id) !== String(req.params.id),
      );

      if (filteredUsers.length === initialLength) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      // Сохраняем в том же формате, в котором считали
      if (Array.isArray(data)) {
        writeUsers(filteredUsers);
      } else {
        data.users = filteredUsers;
        writeUsers(data);
      }

      res.json({ message: "Пользователь удален" });
    } catch (error) {
      console.error("Критическая ошибка:", error);
      res.status(500).json({ error: "Ошибка на сервере" });
    }
  });
}
