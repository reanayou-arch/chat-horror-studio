import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("Groq Horror API работает!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message) {
      return res.json({ reply: "Сообщение пустое." });
    }

    let charText = "";
    if (characters && characters.length > 0) {
      charText = characters
        .map((c) => `${c.name} — ${c.role}`)
        .join("\n");
    }

    const prompt = `
Ты пишешь хоррор-историю в формате Telegram-чата.

Сюжет истории:
${story}

Персонажи:
${charText}

Правила:
- отвечай короткими сообщениями
- отвечают разные персонажи
- формат строго:
Имя: текст

Игрок написал: ${message}
`;

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
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "AI не ответил.";

    res.json({ reply });
  } catch (err) {
    console.error("Ошибка Groq:", err);
    res.status(500).json({ reply: "Ошибка Groq API" });
  }
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
