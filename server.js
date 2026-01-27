import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ✅ Проверка работы сервера
app.get("/", (req, res) => {
  res.send("Groq Horror API работает!");
});

// ✅ Главный чат endpoint
app.post("/chat", async (req, res) => {
  try {

    // ✅ Теперь сервер понимает оба варианта:
    const { message, story, characters, messages } = req.body;

    let finalPrompt = "";

    // ----------------------------
    // ✅ Вариант 1: если пришёл messages (правильно для истории)
    // ----------------------------
    if (messages && Array.isArray(messages)) {
      finalPrompt = messages.map(m => m.content).join("\n");

    } 
    // ----------------------------
    // ✅ Вариант 2: если пришёл message + story (старый формат)
    // ----------------------------
    else if (message) {

      let charText = "";
      if (characters && characters.length > 0) {
        charText = characters
          .map((c) => `${c.name} — ${c.role}`)
          .join("\n");
      }

      finalPrompt = `
Ты пишешь хоррор-историю в формате Telegram-чата.

Сюжет истории:
${story}

Персонажи:
${charText}

Правила:
- отвечай короткими сообщениями
- отвечают разные персонажи
- формат строго:
Имя: текст

Игрок написал: ${message}
      `;
    }

    // ❌ Если вообще ничего не пришло
    else {
      return res.json({ reply: "Сообщение пустое." });
    }

    // ✅ Запрос в Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "user", content: finalPrompt }
          ],
          temperature: 0.85,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "AI не ответил.";

    res.json({ reply });

  } catch (err) {
    console.error("Ошибка Groq says:", err);
    res.status(500).json({ reply: "Ошибка Groq API" });
  }
});

// ✅ Render порт
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
