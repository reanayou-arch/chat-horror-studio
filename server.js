import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Проверка сервера
app.get("/", (req, res) => {
  res.send("Groq AI Server работает ✅");
});

// Главный чат-эндпоинт
app.post("/chat", async (req, res) => {
  try {
    const { message, story } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Нет сообщения" });
    }

    const prompt = `
Ты — персонаж интерактивной истории.

СЮЖЕТ:
${story?.description || "История не задана"}

ПЕРСОНАЖИ:
${story?.characters?.map(c =>
  `${c.name} (${c.role}) — характер: ${c.traits}`
).join("\n") || "Персонажей нет"}

Пользователь пишет: ${message}

Ответь как персонаж истории, продолжая сюжет.
`;

    // Запрос в Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      console.log("Ошибка Groq:", data);
      return res.status(500).json({
        reply: "Ошибка Groq API ❌",
      });
    }

    res.json({
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({
      reply: "Ошибка сервера ❌",
    });
  }
});

// Запуск
app.listen(PORT, () => {
  console.log("Groq Server running on port", PORT);
});
