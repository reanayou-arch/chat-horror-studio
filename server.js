import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Проверка что сервер жив
app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

// POST чат
app.post("/chat", async (req, res) => {
  try {
    const { message, story } = req.body;

    if (!message) {
      return res.json({ reply: "Ошибка: пустое сообщение." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Ты персонаж интерактивной чат-истории.
Ты отвечаешь как живой человек в сюжете.
Сюжет истории:

${story}

Не делай выборы вместо игрока.
Игрок сам пишет действия.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.json({
      reply: "Ошибка сервера. Проверь API ключ или Render.",
    });
  }
});

app.listen(3000, () => console.log("Server started"));
