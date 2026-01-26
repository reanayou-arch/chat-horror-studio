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

  const prompt = `
Ты персонаж чат-истории.

Сюжет:
${story}

Персонажи:
${characters.map(c => `${c.name} — ${c.role}`).join("\n")}

Игрок написал:
"${message}"

Ответь как один из персонажей, продолжая сюжет.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: "Ошибка AI" });
  }
});

app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

app.listen(3000, () => console.log("Server started"));
