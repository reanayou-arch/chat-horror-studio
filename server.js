import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ✅ Проверка сервера */
app.get("/", (req, res) => {
  res.send("✅ Chat Horror API работает!");
});

/* ✅ Главный чат */
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message || !story) {
      return res.status(400).json({ error: "Нет message или story" });
    }

    const systemPrompt = `
Ты — AI внутри хоррор-игры в стиле Telegram.

ПРАВИЛА:
- Отвечай коротко (1–2 строки)
- Реплики как в чате
- Каждый ответ строго от имени персонажа
- Не пиши длинные простыни
- Действия оформляй отдельной репликой в скобках
- Не ломай стиль Telegram

СЮЖЕТ:
${story}

ПЕРСОНАЖИ:
${characters.map(c => `${c.name} — ${c.role}`).join("\n")}

Игрок написал: "${message}"

Ответь строго в формате:

Имя: текст
(действие отдельно)
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.9,
      max_tokens: 120,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Система: ...тишина.";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Groq Error:", err);
    res.status(500).json({
      error: "Ошибка Groq API",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
