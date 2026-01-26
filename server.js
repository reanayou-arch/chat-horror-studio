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
Ты персонаж хоррор-чат истории.

История: ${story}

Персонажи:
${characters.map((c) => "- " + c.name).join("\n")}

Отвечай живо, как человек, короткими сообщениями.
Продолжай сюжет.
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
    res.status(500).json({
      reply: "Ошибка сервера 😢",
    });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
