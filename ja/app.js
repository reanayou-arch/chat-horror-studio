let stories = JSON.parse(localStorage.getItem("stories") || "[]");

function saveStories() {
  localStorage.setItem("stories", JSON.stringify(stories));
}

function renderStories() {
  const list = document.getElementById("storiesList");

  if (stories.length === 0) {
    list.innerHTML = "<p>Историй пока нет</p>";
    return;
  }

  list.innerHTML = stories.map((s, i) => `
    <div class="storyItem">
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <button onclick="startStory(${i})">▶ Начать</button>
    </div>
  `).join("");
}

function createStory() {
  const title = document.getElementById("storyTitle").value.trim();
  const desc = document.getElementById("storyDesc").value.trim();

  if (!title) return alert("Введите название!");

  stories.push({
    title,
    desc,
    chat: []
  });

  saveStories();
  renderStories();

  document.getElementById("storyTitle").value = "";
  document.getElementById("storyDesc").value = "";
}

function startStory(index) {
  localStorage.setItem("playIndex", index);
  location.href = "play.html";
}

renderStories();
