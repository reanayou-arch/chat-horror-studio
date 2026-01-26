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
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты персонаж хоррор-чата. Отвечай живо, коротко, как человек.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log("Ошибка:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

/* ✅ Render использует PORT автоматически */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
