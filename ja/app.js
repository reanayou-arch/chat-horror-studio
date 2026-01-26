const storiesList = document.getElementById("storiesList");

let stories = JSON.parse(localStorage.getItem("stories") || "[]");

function saveStories() {
  localStorage.setItem("stories", JSON.stringify(stories));
}

function renderStories() {
  storiesList.innerHTML = "";

  if (stories.length === 0) {
    storiesList.innerHTML = "<p>Историй пока нет...</p>";
    return;
  }

  stories.forEach((story, index) => {
    const div = document.createElement("div");
    div.className = "storyItem";

    div.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.desc}</p>
      <button onclick="startStory(${index})">▶ Начать чат</button>
    `;

    storiesList.appendChild(div);
  });
}

function createStory() {
  const title = document.getElementById("titleInput").value.trim();
  const desc = document.getElementById("descInput").value.trim();

  if (!title) {
    alert("Введите название истории!");
    return;
  }

  stories.push({
    title,
    desc,
    chat: [
      { from: "Лена", text: "Привет... ты готов к лагерю?" }
    ]
  });

  saveStories();
  renderStories();

  document.getElementById("titleInput").value = "";
  document.getElementById("descInput").value = "";
}

function startStory(index) {
  localStorage.setItem("activeStory", index);
  window.location.href = "play.html";
}

renderStories();
