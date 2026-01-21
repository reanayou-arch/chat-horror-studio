import { loadStories, saveStories } from "./storage.js";

const screen = document.getElementById("screen");
const btn = document.getElementById("newStoryBtn");

let stories = loadStories();

renderHome();

function renderHome() {
  screen.innerHTML = `
    <button id="newStoryBtn">➕ Новая история</button>
    ${stories.length === 0 ? `<p class="hint">Историй пока нет</p>` : ""}
    ${stories.map((s, i) => `
      <div class="story">
        <b>${s.title}</b><br>
        <small>${s.lines.length} событий</small><br>
        <button onclick="play(${i})">▶ Играть</button>
      </div>
    `).join("")}
  `;

  document.getElementById("newStoryBtn").onclick = newStory;
}

window.play = (i) => {
  localStorage.setItem("current_story", i);
  location.href = "play.html";
};

function newStory() {
  screen.innerHTML = `
    <h3>Новая история</h3>

    <input id="title" placeholder="Название истории">

    <textarea id="chars" rows="4"
      placeholder="Алина🙂
Неизвестный👁️"></textarea>

    <textarea id="story" rows="6"
      placeholder="Алина: Ты здесь?
Неизвестный: Я ждал тебя"></textarea>

    <button id="saveBtn">💾 Сохранить</button>
    <button id="backBtn">⬅ Назад</button>
  `;

  document.getElementById("backBtn").onclick = renderHome;

  document.getElementById("saveBtn").onclick = () => {
    const title = document.getElementById("title").value.trim();
    const lines = document.getElementById("story").value.split("\\n");

    if (!title || lines.length === 0) return alert("Заполни историю");

    stories.push({ title, lines });
    saveStories(stories);
    renderHome();
  };
}
