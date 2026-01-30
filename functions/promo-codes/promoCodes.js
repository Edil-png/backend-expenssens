import { app,readData } from "../../index.js";

export function promoCodes (){
  app.get("/api/promocodes", (req, res) => {
  try {
    const data = readData();
    res.json(data.promoCodes);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении промокодов" });
  }
});

app.get("/api/promocodes/validate/:code", (req, res) => {
  try {
    const data = readData();
    const code = req.params.code.toUpperCase();

    const promoCode = data.promoCodes.find((p) => p.code === code);

    if (!promoCode) {
      return res
        .status(404)
        .json({ valid: false, error: "Промокод не найден" });
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, error: "Промокод истек" });
    }

    res.json({ valid: true, promoCode });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при проверке промокода" });
  }
});
}