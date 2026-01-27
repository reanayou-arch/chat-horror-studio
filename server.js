import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant"; 
// ✅ Эта модель точно работает сейчас

app.get("/", (req, res) => {
  res.send("Groq API работает!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, story } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Нет сообщения",
      });
    }

    const systemPrompt = `
Ты — рассказчик хоррор-истории.

История:
${story || "Без описания"}

Начни сюжет первым сообщением, если игрок только вошёл.
Отвечай атмосферно и подробно.
`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Нет ответа от Groq";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Ошибка Groq:", err);

    res.status(500).json({
      reply: "Ошибка Groq API. Проверь ключ и модель.",
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Groq Server running on port", PORT);
});
