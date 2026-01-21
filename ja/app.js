const screen = document.getElementById("screen");

let stories = JSON.parse(localStorage.getItem("stories") || "[]");

function save() {
  localStorage.setItem("stories", JSON.stringify(stories));
}

function renderHome() {
  screen.innerHTML = `
    <button onclick="createStory()">➕ Новая история</button>

    ${
      stories.length === 0
        ? `<div class="empty">Историй пока нет</div>`
        : stories.map((s, i) => `
            <div class="story">
              <div class="story-title">${s.title}</div>
              <div class="story-meta">${s.lines.length} сообщений</div>
              <button onclick="play(${i})">▶ Играть</button>
            </div>
          `).join("")
    }
  `;
}

window.createStory = function () {
  const title = prompt("Название истории:");
  if (!title) return;

  stories.push({
    title,
    lines: [{ author: "Система", text: "Начало истории" }]
  });

  save();
  renderHome();
};

window.play = function (index) {
  localStorage.setItem("playIndex", index);
  location.href = "play.html";
};

renderHome();
