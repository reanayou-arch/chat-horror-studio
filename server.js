import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, story, characters } = req.body;

  try {
    const prompt = `
Ты персонаж хоррор-чата.

Сюжет истории:
${story}

Персонажи:
${characters.map(c => `${c.name} — ${c.role}`).join("\n")}

Игрок написал:
"${message}"

Продолжи сюжет как живой человек.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ reply: "Ошибка сервера AI 😢" });
  }
});

app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

/* ✅ ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on " + PORT));
