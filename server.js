import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ✅ Проверка сервера
app.get("/", (req, res) => {
  res.send("✅ Chat Horror Server работает!");
});


// ✅ Главный чат-роут
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message || !story) {
      return res.status(400).json({
        error: "Нет message или story",
      });
    }

    // Формируем строгий промпт
    const systemPrompt = `
Ты — сценарист хоррор-игры в стиле Telegram.

Правила:
- Пиши ТОЛЬКО короткими репликами (1–2 предложения).
- Персонажи отвечают строго по своим ролям.
- Не пиши длинные простыни.
- Если персонаж делает действие — это отдельное сообщение.
- Каждый ответ начинается с имени персонажа.

Сюжет:
${story}

Персонажи:
${characters.map(c => `${c.name} — ${c.role}`).join("\n")}

Игрок пишет: "${message}"

Ответь следующим сообщением в формате:

Имя: реплика
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
      ],
      temperature: 0.9,
      max_tokens: 120,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Персонаж молчит...";

    res.json({ reply });

  } catch (err) {
    console.error("🔥 Groq Error:", err);
    res.status(500).json({
      error: "Ошибка Groq API",
      details: err.message,
    });
  }
});


// Render порт
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
