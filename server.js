import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Groq API Key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Главная страница Render (чтобы не было Not Found)
app.get("/", (req, res) => {
  res.send("✅ Chat Horror Server работает!");
});

// ✅ Основной чат API
app.post("/chat", async (req, res) => {
  try {
    const { messages, characters } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Нет messages" });
    }

    // 🎭 Персонажи (роли)
    let charText = "";
    if (characters && characters.length > 0) {
      charText =
        "\nПерсонажи истории:\n" +
        characters.map((c) => `- ${c.name}: ${c.role}`).join("\n");
    }

    // 🧠 System Prompt (строго короткий Telegram стиль)
    const systemPrompt = `
Ты — AI ведущий хоррор-истории в формате Telegram-чата.
Пиши ТОЛЬКО короткими сообщениями, максимум 1–2 предложения.

Правила:
- Персонажи отвечают строго по своим ролям.
- Реплики должны быть короткими.
- Если персонаж делает действие — отдельным сообщением в скобках.
- Не пиши длинные простыни текста.
${charText}
`;

    // Groq запрос
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content || "Нет ответа";

    res.json({ reply });
  } catch (err) {
    console.error("Ошибка Groq:", err);
    res.status(500).json({ error: "Ошибка Groq API" });
  }
});

// ✅ Render Port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
