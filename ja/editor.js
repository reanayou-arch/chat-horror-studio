let stories = JSON.parse(localStorage.getItem("stories") || "[]");
let index = localStorage.getItem("editIndex");

const story = stories[index];

const charList = document.getElementById("charList");

// ===== СОХРАНИТЬ =====
function save() {
  localStorage.setItem("stories", JSON.stringify(stories));
}

// ===== ПОКАЗ ПЕРСОНАЖЕЙ =====
function renderCharacters() {
  charList.innerHTML = "";

  story.characters.forEach((c) => {
    const div = document.createElement("div");
    div.className = "charItem";

    div.innerHTML = `
      <img src="${c.avatar}">
      <b>${c.name}</b>
    `;

    charList.appendChild(div);
  });
}

// ===== ДОБАВИТЬ ПЕРСОНАЖА =====
window.addCharacter = function () {
  const name = document.getElementById("charName").value.trim();
  const file = document.getElementById("charAvatar").files[0];

  if (!name) {
    alert("Введите имя персонажа!");
    return;
  }

  if (!file) {
    alert("Загрузите аватарку!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    story.characters.push({
      name,
      avatar: reader.result
    });

    save();
    renderCharacters();

    document.getElementById("charName").value = "";
    document.getElementById("charAvatar").value = "";
  };

  reader.readAsDataURL(file);
};

// ===== НАЗАД =====
window.goBack = function () {
  location.href = "index.html";
};

renderCharacters();
