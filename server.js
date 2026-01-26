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
  const { message } = req.body;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Ты персонаж из хоррор-чата. Отвечай коротко, живо, как человек.",
      },
      { role: "user", content: message },
    ],
  });

  res.json({ reply: completion.choices[0].message.content });
});

app.listen(3000, () => console.log("Server started"));
