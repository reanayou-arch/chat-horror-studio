const chatBox = document.getElementById("chatBox");
const storyTitle = document.getElementById("storyTitle");

let stories = JSON.parse(localStorage.getItem("stories") || "[]");
let activeIndex = localStorage.getItem("activeStory");

if (activeIndex === null) {
  alert("История не выбрана!");
  window.location.href = "index.html";
}

let story = stories[activeIndex];

storyTitle.innerText = story.title;

function renderChat() {
  chatBox.innerHTML = "";

  story.chat.forEach(msg => {
    const div = document.createElement("div");

    div.className = msg.from === "Вы" ? "msg you" : "msg npc";

    div.innerHTML = `
      <b>${msg.from}:</b><br>
      ${msg.text}
    `;

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();

  if (!text) return;

  story.chat.push({ from: "Вы", text });
  input.value = "";
  renderChat();

  // Ответ бота через API
  try {
    const res = await fetch("https://chat-horror-api.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    story.chat.push({ from: "Лена", text: data.reply });

  } catch (err) {
    story.chat.push({ from: "Ошибка", text: "Сервер не отвечает 😢" });
  }

  stories[activeIndex] = story;
  localStorage.setItem("stories", JSON.stringify(stories));

  renderChat();
}

function goBack() {
  window.location.href = "index.html";
}

renderChat();
