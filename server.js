import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama3-70b-8192";

/* ✅ Проверка что сервер жив */
app.get("/", (req, res) => {
  res.send("✅ Chat Horror Server работает!");
});

/* ✅ Чтобы /chat не показывал Not Found */
app.get("/chat", (req, res) => {
  res.send("✅ Use POST /chat");
});

/* ✅ Главный маршрут для игры */
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message) {
      return res.json({ reply: "Нет сообщения." });
    }

    const systemPrompt = `
Ты пишешь хоррор-чат как Telegram.
Пиши короткими репликами.
Персонажи отвечают строго по ролям.

Сюжет:
${story}

Персонажи:
${characters
  .map((c) => `${c.name} — ${c.role}`)
  .join("\n")}

Формат ответа строго JSON:

{
 "name": "Имя персонажа",
 "text": "короткая реплика"
}
`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    let raw = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        name: "Персонаж",
        text: raw.slice(0, 200),
      };
    }

    res.json({
      reply: parsed.text,
      character: parsed.name,
    });
  } catch (err) {
    console.error("❌ Ошибка Groq:", err.message);
    res.status(500).json({
      reply: "Ошибка Groq API",
      error: err.message,
    });
  }
});

/* ✅ Render порт */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
