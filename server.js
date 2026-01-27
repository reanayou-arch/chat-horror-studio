import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    const prompt = `
Ты участвуешь в интерактивной истории.

СЮЖЕТ:
${story}

ПЕРСОНАЖИ:
${characters.map(c => `${c.name} (${c.role}, ${c.mood})`).join("\n")}

Игрок написал:
"${message}"

Продолжи историю как персонаж.
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.log("Ошибка Groq:", err);
    res.json({
      reply: "❌ Ошибка Groq API. Проверь ключ и модель."
    });
  }
});

app.listen(10000, () => {
  console.log("Groq Server running on port 10000");
});
