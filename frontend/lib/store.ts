"use client";

import { CategoryState, Entry } from "./types";

// 🌍 GLOBAL SETTINGS
// 0 = Sunday (US/Japan), 1 = Monday (Europe/ISO)
export const WEEK_START_DAY = 1; 

const CATEGORY_KEY = "heiyu_categories";
const ENTRY_KEY = "heiyu_budget_entries";

const DEFAULT_CATEGORIES: CategoryState = {
  incomeCategories: ["Salary", "Freelance", "Gift", "Other"],
  expenseCategories: ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Health", "Other"],
};

// --- Date Logic Helper ---

export const getWeekBounds = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const currentDay = start.getDay(); // 0=Sun, 1=Mon, ...
  
  // Calculate difference from the configured start day
  // (currentDay - startDay + 7) % 7 handles wrapping around (e.g. Sun -> Mon)
  const diff = (currentDay - WEEK_START_DAY + 7) % 7;

  start.setDate(start.getDate() - diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// --- Categories ---

export const loadCategories = (): CategoryState => {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const saved = localStorage.getItem(CATEGORY_KEY);
    if (!saved) return DEFAULT_CATEGORIES;
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load categories", e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: CategoryState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error("Failed to save categories", e);
  }
};

// --- Entries ---

export const loadEntries = (): Entry[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(ENTRY_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const saveEntries = (entries: Entry[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENTRY_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save entries", e);
  }
};