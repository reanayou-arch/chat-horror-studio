import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

/* -------------------- */
/* 1) Middleware */
/* -------------------- */

app.use(express.json());

app.use(
  cors({
    origin: "*", // разрешаем запросы с GitHub Pages
  })
);

/* -------------------- */
/* 2) OpenAI Client */
/* -------------------- */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* -------------------- */
/* 3) Проверка сервера */
/* -------------------- */

// Главная страница
app.get("/", (req, res) => {
  res.send("✅ Chat Horror API работает!");
});

// Если кто-то открыл /chat через браузер
app.get("/chat", (req, res) => {
  res.send("⚠️ Используй POST запрос, а не GET.");
});

/* -------------------- */
/* 4) Основной чат */
/* -------------------- */

app.post("/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    if (!message) {
      return res.json({ reply: "❌ Сообщение пустое" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Ты персонаж хоррор-чат истории.
Отвечай коротко, естественно, как живой человек.
Не пиши длинных рассказов.
Персонаж: ${character || "Неизвестный"}
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
  } catch (error) {
    console.error("Ошибка API:", error);

    res.json({
      reply: "❌ Ошибка сервера. Проверь API ключ.",
    });
  }
});

/* -------------------- */
/* 5) Render PORT */
/* -------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server started on port " + PORT);
});
