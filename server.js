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
  const { plot, characters, message } = req.body;

  const charInfo = characters.map(c =>
    `${c.name} (${c.role}) характер: ${c.mood}`
  ).join("\n");

  const systemPrompt = `
Ты — ИИ ведущий чат-истории.

СЮЖЕТ:
${plot}

ПЕРСОНАЖИ:
${charInfo}

Игрок пишет сообщение.
Ты отвечаешь как персонажи в реальной переписке.
Коротко, живо, по сюжету.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ reply: "Ошибка ИИ сервера" });
  }
});

app.get("/", (req,res)=>{
  res.send("Chat Horror API работает!");
});

app.listen(3000, () => console.log("Server started"));
