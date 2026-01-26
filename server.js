import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   OpenAI Client
========================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   Главная проверка сервера
========================= */
app.get("/", (req, res) => {
  res.send("✅ Chat Horror API работает!");
});

/* =========================
   Чтобы браузер не писал Cannot GET /chat
========================= */
app.get("/chat", (req, res) => {
  res.send("❗ Используй POST запрос, а не GET.");
});

/* =========================
   Главный чат-эндпоинт
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, story, characters } = req.body;

    if (!message) {
      return res.json({ reply: "Сообщение пустое..." });
    }

    /* =========================
       Формируем персонажей
    ========================= */
    let charText = "";

    if (characters && characters.length > 0) {
      charText = characters
        .map(
          (c) =>
            `- ${c.name} (${c.role}), характер: ${c.traits}`
        )
        .join("\n");
    } else {
      charText = "Персонажи не заданы.";
    }

    /* =========================
       Главный промпт
    ========================= */
    const systemPrompt = `
Ты — чат-бот внутри интерактивной истории.

История:
${story}

Персонажи:
${charText}

Правила:
- Пиши как живой человек в переписке (Telegram стиль)
- Отвечай от имени персонажей
- Развивай сюжет постепенно
- Реагируй на действия игрока
- Не пиши как робот
- Не придумывай новые жанры, держись истории
`;

    /* =========================
       Запрос к OpenAI
    ========================= */
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("Ошибка:", error);
    res.json({
      reply: "❌ Ошибка сервера. Проверь Render и ключ API.",
    });
  }
});

/* =========================
   Render порт
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("✅ Server started on port", PORT)
);
