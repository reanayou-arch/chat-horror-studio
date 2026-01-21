const KEY = "chat_horror_stories_v1";

export function loadStories() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveStories(stories) {
  localStorage.setItem(KEY, JSON.stringify(stories));
}
