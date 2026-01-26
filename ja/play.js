const API_URL = "https://chat-horror-api.onrender.com/chat";

let stories = JSON.parse(localStorage.getItem("stories") || "[]");
let index = localStorage.getItem("playIndex");

if (index === null) {
  alert("История не выбрана!");
  location.href = "index.html";
}

let story = stories[index];

document.getElementById("storyName").innerText = story.title;

function save() {
  stories[index] = story;
  localStorage.setItem("stories", JSON.stringify(stories));
}

function renderChat() {
  const box = document.getElementById("chatBox");
  box.innerHTML = "";

  story.chat.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.role === "user" ? "msg user" : "msg bot";
    div.innerText = msg.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text) return;

  story.chat.push({ role: "user", text });
  input.value = "";
  renderChat();
  save();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    story.chat.push({ role: "bot", text: data.reply });
    renderChat();
    save();
  } catch {
    story.chat.push({ role: "bot", text: "❌ Сервер не отвечает" });
    renderChat();
  }
}

function goBack() {
  location.href = "index.html";
}

renderChat();
