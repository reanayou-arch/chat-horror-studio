import express from "express";
import cors from "cors";
import OpenAI from "openai";

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
    const { message, story, characters } = req.body;

    const systemPrompt = `
Ты — живой персонаж из чат-истории.

СЮЖЕТ:
${story}

ПЕРСОНАЖИ:
${characters.map((c) => "- " + c.name).join("\n")}

Правила:
- Отвечай как персонаж в реальной переписке
- Коротко, живо, по сюжету
- Не пиши “я ИИ”
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on", PORT));
