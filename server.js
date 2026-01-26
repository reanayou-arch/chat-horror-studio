import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ✅ Проверка что сервер жив
app.get("/", (req, res) => {
  res.send("✅ Chat Horror API работает!");
});


// ✅ Если кто-то открыл /chat в браузере
app.get("/chat", (req, res) => {
  res.send("❗ Используй POST запрос, а не GET");
});


// ✅ Основной чат-запрос
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Ошибка: нет сообщения" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты персонаж хоррор-чата. Отвечай коротко, живо, как реальный человек. Продолжай сюжет.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Ошибка OpenAI:", err);
    res.json({
      reply: "❌ Ошибка сервера. Проверь API ключ.",
    });
  }
});


// ✅ ВАЖНО: Render требует process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server started on port", PORT);
});
