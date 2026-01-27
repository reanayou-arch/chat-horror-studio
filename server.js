const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

app.post("/chat", async (req, res) => {
  try {
    const { story, message } = req.body;

    if (!message) {
      return res.json({ reply: "Нет сообщения." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты персонаж интерактивной чат-истории. Всегда отвечай как герой сюжета.",
        },
        {
          role: "user",
          content: `Сюжет: ${story}\n\nСообщение игрока: ${message}`,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("🔥 Ошибка OpenAI:", err.message);

    res.status(500).json({
      reply: "Ошибка OpenAI: " + err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
