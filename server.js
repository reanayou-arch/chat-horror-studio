import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Groq Horror API работает!");
});

/* ✅ Главный endpoint */
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    const prompt = `
Ты участвуешь в хоррор-чате Telegram.

Сюжет:
${story}

Персонажи:
${characters.map(c => `${c.name} (${c.role})`).join(", ")}

Игрок написал: "${message}"

Ответь короткими репликами, максимум 1–2 предложения.
Каждая реплика должна быть в формате:

Имя: текст

Если действие, то:

(описание действия)
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content;

    res.json({ reply });

  } catch (err) {
    res.json({ reply: null, error: err.message });
  }
});

/* Render порт */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
