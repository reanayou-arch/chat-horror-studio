import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Проверка что сервер жив */
app.get("/", (req, res) => {
  res.send("Chat Horror API работает!");
});

/* ✅ OpenAI клиент */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ✅ Главный чат */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Ты персонаж хоррор-чат истории.
Отвечай коротко, живо, как человек.
Не пиши длинных текстов.
`,
        },
        {
          role: "user",
          content: message,
        },
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

/* ✅ Render требует PORT */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
