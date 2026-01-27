import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Главная проверка сервера */
app.get("/", (req, res) => {
  res.send("✅ Сервер работает нормально!");
});

/* ✅ Чтобы /chat не показывал Not Found */
app.get("/chat", (req, res) => {
  res.send("✅ /chat работает! Используй POST запрос для общения.");
});

/* ✅ Groq API */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ✅ Основной чат */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "❌ Нет сообщения!"
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Ты пишешь короткими репликами как в Telegram. Отвечают разные персонажи."
        },
        { role: "user", content: userMessage }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("🔥 Groq Error FULL:", err);

    res.status(500).json({
      reply: "❌ Ошибка Groq API. Проверь ключ и модель."
    });
  }
});

/* ✅ Запуск */
app.listen(10000, () => {
  console.log("✅ Groq Server running on port 10000");
});
