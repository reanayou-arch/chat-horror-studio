import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;


// Проверка сервера
app.get("/", (req, res) => {
  res.send("✅ Groq Horror API работает!");
});


// Чат endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Нет messages" });
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages,
          max_tokens: 200,
          temperature: 0.9,
        }),
      }
    );

    const data = await groqResponse.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: "Groq не вернул ответ",
        raw: data,
      });
    }

    res.json({
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    res.status(500).json({
      error: "Ошибка сервера Groq",
      details: err.message,
    });
  }
});


// Запуск
app.listen(PORT, () => {
  console.log("✅ Сервер запущен на порту:", PORT);
});
