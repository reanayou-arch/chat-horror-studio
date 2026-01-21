import { loadStories, saveStories } from "./storage.js";

const screen = document.getElementById("screen");
let stories = loadStories();

renderHome();

function renderHome() {
  screen.innerHTML = `
    <button id="newStory">➕ Новая история</button>
    ${stories.length === 0 ? "<p>Историй пока нет</p>" : ""}
    ${stories.map((s, i) => `
      <div class="story">
        <b>${s.title}</b><br>
        <small>${s.lines.length} сообщений</small><br>
        <button onclick="play(${i})">▶ Играть</button>
      </div>
    `).join("")}
  `;

  document.getElementById("newStory").onclick = createStory;
}

window.play = (i) => {
  localStorage.setItem("current_story", i);
  location.href = "play.html";
};

function createStory() {
  screen.innerHTML = `
    <h3>Новая история</h3>

    <input id="title" placeholder="Название истории">

    <textarea id="story" rows="6"
      placeholder="Алина: Ты здесь?
Неизвестный: Я ждал тебя"></textarea>

    <button id="save">💾 Сохранить</button>
    <button id="back">⬅ Назад</button>
  `;

  document.getElementById("back").onclick = renderHome;

  document.getElementById("save").onclick = () => {
    const title = document.getElementById("title").value.trim();
    const lines = document.getElementById("story").value.split("\n");

    if (!title || lines.length === 0) {
      alert("Заполни историю");
      return;
    }

    stories.push({ title, lines });
    saveStories(stories);
    renderHome();
  };
}
