import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUsers } from "./getUsers.js";
import { postUsers } from "./postUsers.js";
import { deleteUser } from "./deleteUsers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userPath = path.join(__dirname, "../../data/users.json");

// Структура по умолчанию, соответствующая логике вашего API
const INITIAL_STRUCTURE = {
  users: [],
};

export function readUsers() {
  try {
    if (!fs.existsSync(userPath)) {
      const dir = path.dirname(userPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(userPath, JSON.stringify(INITIAL_STRUCTURE, null, 2));
      return INITIAL_STRUCTURE;
    }

    const data = fs.readFileSync(userPath, "utf-8");
    // Если файл пустой, возвращаем начальную структуру, а не массив
    return data ? JSON.parse(data) : INITIAL_STRUCTURE;
  } catch (error) {
    console.error("Ошибка при чтении базы пользователей:", error);
    // Возвращаем структуру, чтобы методы .users не ломались
    return INITIAL_STRUCTURE;
  }
}

// Добавьте 'data' в скобки
export function writeUsers(data) { 
  fs.writeFileSync(userPath, JSON.stringify(data, null, 2));
}
export function Users() {
  getUsers();
  deleteUser()
  postUsers();
}
