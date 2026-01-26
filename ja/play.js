<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Чат-история</title>

  <style>
    body {
      margin: 0;
      font-family: system-ui;
      background: #050b18;
      color: white;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    header {
      padding: 15px;
      font-size: 20px;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    #chat {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .msg {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      max-width: 85%;
    }

    .msg.bot {
      align-self: flex-start;
    }

    .msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
      background: #222;
    }

    .bubble {
      padding: 12px 14px;
      border-radius: 18px;
      font-size: 15px;
      line-height: 1.3;
      white-space: pre-wrap;
      word-break: break-word;
      max-width: 100%;
    }

    .bot .bubble {
      background: rgba(255, 255, 255, 0.08);
    }

    .user .bubble {
      background: #2563eb;
    }

    footer {
      display: flex;
      padding: 10px;
      gap: 10px;
      background: rgba(255, 255, 255, 0.05);
    }

    input {
      flex: 1;
      padding: 14px;
      border-radius: 14px;
      border: none;
      font-size: 16px;
      outline: none;
    }

    button {
      width: 55px;
      border: none;
      border-radius: 14px;
      background: #22c55e;
      font-size: 20px;
      cursor: pointer;
      color: white;
    }
  </style>
</head>

<body>

  <header id="storyTitle">История...</header>

  <div id="chat"></div>

  <footer>
    <input id="text" placeholder="Напиши сообщение..." />
    <button onclick="send()">➤</button>
  </footer>

<script>
/* ============================
   ЗАГРУЗКА ИСТОРИИ
============================ */

let stories = JSON.parse(localStorage.getItem("stories") || "[]");
let playIndex = localStorage.getItem("playIndex");

let story = stories[playIndex];

const chat = document.getElementById("chat");
const storyTitle = document.getElementById("storyTitle");

storyTitle.innerText = story.title;

/* ============================
   АВАТАРЫ
============================ */

function getBotCharacter() {
  if (story.characters.length > 0) {
    return story.characters[0]; // первый персонаж отвечает
  }

  return {
    name: "Неизвестный",
    avatar: "https://i.imgur.com/4M34hi2.png"
  };
}

const botChar = getBotCharacter();

/* ============================
   ДОБАВИТЬ СООБЩЕНИЕ
============================ */

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;

  let avatarSrc =
    sender === "user"
      ? "https://i.imgur.com/HYcn9xO.png"
      : botChar.avatar;

  div.innerHTML = `
    <img class="avatar" src="${avatarSrc}">
    <div class="bubble">${text}</div>
  `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ============================
   ПЕРВЫЙ СЮЖЕТНЫЙ ТЕКСТ
============================ */

if (story.messages.length === 0) {
  addMessage("📖 Сюжет: " + story.desc, "bot");
}

/* ============================
   ОТПРАВКА
============================ */

async function send() {
  const input = document.getElementById("text");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  addMessage("печатает...", "bot");

  try {
    const response = await fetch("https://chat-horror-api.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `
Ты персонаж хоррор-истории.
История: ${story.title}

Сюжет: ${story.desc}

Персонажи: ${story.characters.map(c => c.name).join(", ")}

Игрок написал: ${text}

Ответь как персонаж, коротко и живо, продолжая сюжет.
`
      })
    });

    const data = await response.json();

    // удалить "печатает..."
    chat.lastChild.remove();

    addMessage(data.reply, "bot");

  } catch (err) {
    chat.lastChild.remove();
    addMessage("❌ Сервер не отвечает (Render может спать)", "bot");
  }
}
</script>

</body>
</html>
