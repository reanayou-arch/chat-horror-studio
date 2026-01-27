import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "Привет";
    const story = req.body.story || {};

    const systemPrompt = `
Ты — интерактивный рассказчик.
История: ${story.title || "Без названия"}

Описание сюжета:
${story.description || "Нет описания"}

Персонажи:
${(story.characters || [])
  .map((c) => `${c.name} (${c.role}) — ${c.trait}`)
  .join("\n")}
`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log("Ошибка Groq:", err);
    res.status(500).json({
      reply: "Ошибка Groq API ❌",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Groq server работает!");
});

app.listen(10000, () => {
  console.log("Groq Server running on port 10000");
});
