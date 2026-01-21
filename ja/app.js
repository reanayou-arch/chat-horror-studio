const screen = document.getElementById("screen");
const btn = document.getElementById("newStoryBtn");

btn.addEventListener("click", () => {
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

  document.getElementById("backBtn").onclick = () => location.reload();

  document.getElementById("saveBtn").onclick = () => {
    alert("История сохранена (пока без базы)");
  };
});
