const storiesList = document.getElementById("storiesList");

let stories = JSON.parse(localStorage.getItem("stories") || "[]");

// ===== СОХРАНЕНИЕ =====
function saveStories() {
  localStorage.setItem("stories", JSON.stringify(stories));
}

// ===== СОЗДАТЬ ИСТОРИЮ =====
window.createStory = function () {
  const title = document.getElementById("titleInput").value.trim();
  const desc = document.getElementById("descInput").value.trim();

  if (!title) {
    alert("Введите название истории!");
    return;
  }

  stories.push({
    title,
    desc,
    characters: [],
    messages: []
  });

  saveStories();
  renderStories();

  document.getElementById("titleInput").value = "";
  document.getElementById("descInput").value = "";
};

// ===== РЕНДЕР СПИСКА =====
function renderStories() {
  storiesList.innerHTML = "";

  if (stories.length === 0) {
    storiesList.innerHTML = "<p>Историй пока нет</p>";
    return;
  }

  stories.forEach((story, index) => {
    const div = document.createElement("div");
    div.className = "storyItem";

    div.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.desc || "Без описания"}</p>

      <button onclick="openEditor(${index})">✍ Редактировать</button>
      <button onclick="startStory(${index})">▶ Начать чат</button>
    `;

    storiesList.appendChild(div);
  });
}

// ===== ОТКРЫТЬ РЕДАКТОР =====
window.openEditor = function (index) {
  localStorage.setItem("editIndex", index);
  location.href = "editor.html";
};

// ===== НАЧАТЬ ИГРУ =====
window.startStory = function (index) {
  localStorage.setItem("playIndex", index);
  location.href = "play.html";
};

renderStories();
