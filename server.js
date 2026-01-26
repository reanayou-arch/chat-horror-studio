import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, story, characters } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Ты персонаж хоррор-чата.
Сюжет: ${story}
Персонажи: ${characters.map(c => c.name).join(", ")}
Отвечай живо, как человек.
`
        },
        { role: "user", content: message }
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    res.status(500).json({
      reply: "Ошибка AI сервера 😢"
    });
  }
});

app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on " + PORT));
