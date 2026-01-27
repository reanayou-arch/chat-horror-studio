import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

/* ✅ Проверка ключа */
if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY не задан в Render Environment!");
}

/* ✅ Главная страница */
app.get("/", (req, res) => {
  res.send("Groq Horror API работает!");
});

/* ✅ Чат */
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message) {
      return res.json({ reply: "Сообщение пустое." });
    }

    /* ✅ Формируем персонажей */
    let charText = "";
    if (characters && characters.length > 0) {
      charText = characters
        .map((c) => `${c.name} — ${c.role}`)
        .join("\n");
    }

    /* ✅ Промпт */
    const prompt = `
Ты пишешь хоррор-историю в формате Telegram-чата.

Сюжет:
${story}

Персонажи:
${charText}

Правила:
- отвечай короткими сообщениями
- отвечают разные персонажи строго по ролям
- формат строго:
Имя: текст
- действия отдельно:
(персонаж делает что-то)

Игрок написал: ${message}
`;

    /* ✅ Запрос в Groq */
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      }
    );

    /* ✅ Если Groq вернул ошибку */
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Groq API Error:", errorText);

      return res.json({
        reply: "Ошибка Groq: API вернул ошибку.",
      });
    }

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "AI не ответил.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Ошибка сервера:", err);

    res.status(500).json({
      reply: "Ошибка сервера Groq API",
    });
  }
});

/* ✅ Render порт */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
