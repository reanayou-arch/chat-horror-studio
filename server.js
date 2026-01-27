import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   GROQ API
================================ */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ================================
   TEST ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("✅ Groq Story API работает!");
});

/* ================================
   CHAT ROUTE
================================ */

app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "❌ Нет сообщения",
      });
    }

    // Формируем персонажей в текст
    let charactersText = "";
    if (characters && characters.length > 0) {
      charactersText = characters
        .map(
          (c) =>
            `- ${c.name} (${c.role}): характер — ${c.traits}`
        )
        .join("\n");
    }

    // Главный промпт для ИИ
    const systemPrompt = `
Ты — интерактивный рассказчик хоррор-историй в формате переписки.

📌 Автор задал историю:
"${story?.description || "Нет описания"}"

📌 Персонажи:
${charactersText || "Нет персонажей"}

Правила:
- Пиши как чат-переписка
- Развивай сюжет постепенно
- Персонажи должны вести себя согласно описанию
- Не делай выбор за игрока
- Заверши сообщение вопросом: "Что ты делаешь дальше?"
`;

    // Запрос к Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // ✅ рабочая модель
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "❌ Пустой ответ от Groq";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Ошибка Groq:", err);

    res.status(500).json({
      reply: "❌ Ошибка Groq API. Проверь ключ и модель.",
    });
  }
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
