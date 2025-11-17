// entriesStore.js
const MAIN_KEY = "heiyu_budget_entries";
const BACKUP_KEY = "heiyu_budget_entries_backup";

export function loadEntries() {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(MAIN_KEY);
    if (saved) return JSON.parse(saved);

    const backup = localStorage.getItem(BACKUP_KEY);
    return backup ? JSON.parse(backup) : [];
  } catch (err) {
    console.error("Failed to load entries:", err);
    return [];
  }
}

export function saveEntries(newEntries) {
  if (typeof window === "undefined") return;

  try {
    const data = JSON.stringify(newEntries);
    localStorage.setItem(MAIN_KEY, data);
    localStorage.setItem(BACKUP_KEY, data);
  } catch (err) {
    console.error("Failed to save entries:", err);
  }
}
