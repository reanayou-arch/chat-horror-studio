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
    let { message, story, characters } = req.body;

    // ✅ защита от undefined
    if (!story) story = "История без описания.";
    if (!characters || !Array.isArray(characters)) characters = [];

    const charText =
      characters.length > 0
        ? characters.map(c =>
            `${c.name} (${c.role}, ${c.mood})`
          ).join("\n")
        : "Персонажей нет.";

    const prompt = `
Ты участвуешь в интерактивной истории ужасов.

СЮЖЕТ:
${story}

ПЕРСОНАЖИ:
${charText}

Игрок написал:
"${message}"

Продолжи историю красиво, атмосферно и страшно.
Ответь как персонаж.
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("Ошибка Groq:", err);

    res.status(500).json({
      reply: "❌ Ошибка Groq API. Сервер упал."
    });
  }
});

app.listen(10000, () => {
  console.log("✅ Groq Server running on port 10000");
});
