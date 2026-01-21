const STORAGE_KEY = "chat_horror_stories_v1";

export function loadStories() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveStories(stories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
