"use client";

const STORAGE_KEY = "cabinet-registry-stars";

function getStarred(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStarred(starred: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(starred));
}

export function isStarred(slug: string): boolean {
  return getStarred()[slug] === true;
}

export function toggleStar(slug: string): boolean {
  const starred = getStarred();
  const newState = !starred[slug];
  if (newState) {
    starred[slug] = true;
  } else {
    delete starred[slug];
  }
  saveStarred(starred);
  return newState;
}

export function getStarCount(): number {
  return Object.keys(getStarred()).length;
}
