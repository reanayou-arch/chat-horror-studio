import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===== Проверка что сервер жив ===== */
app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

/* ===== Главный чат маршрут ===== */
app.post("/chat", async (req, res) => {
  try {
    const { message, story } = req.body;

    if (!message) {
      return res.json({ reply: "Сообщение пустое." });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: "❌ Нет API ключа на Render. Добавь OPENAI_API_KEY."
      });
    }

    /* ===== Запрос в OpenAI ===== */
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
Ты персонаж хоррор чат-истории.
Вот сюжет:

${story}

Отвечай как герой истории.
Не пиши длинно.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "❌ Ошибка: пустой ответ от OpenAI.";

    res.json({ reply });

  } catch (err) {
    console.log("Ошибка сервера:", err);
    res.status(500).json({
      reply: "❌ Сервер упал. Проверь Render Logs."
    });
  }
});

/* ===== Запуск Render ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
