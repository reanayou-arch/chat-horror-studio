import { loadStories } from "./storage.js";

const index = localStorage.getItem("current_story");
const stories = loadStories();
const story = stories[index];

const chat = document.getElementById("chat");
const title = document.getElementById("title");

title.innerText = story.title;

let i = 0;

function next() {
  if (i >= story.lines.length) return;

  const line = story.lines[i++];
  let user = "Система";
  let text = line;

  if (line.includes(":")) {
    [user, text] = line.split(":");
  }

  const div = document.createElement("div");
  div.className = "msg";

  div.innerHTML =
    user === "Система"
      ? `<div class="bubble">${text}</div>`
      : `<div class="user">${user}</div><div class="bubble">${text}</div>`;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(next, 1000);
}

next();
