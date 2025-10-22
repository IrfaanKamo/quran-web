import { QuranProgress } from "@/types/gameplay";

// Quran Progress
export function loadQuranProgress(): QuranProgress | null {
  const savedProgress = localStorage.getItem(`quran_progress`);
  return savedProgress ? JSON.parse(savedProgress) : null;
}

export function saveQuranProgress(progress: QuranProgress) {
  localStorage.setItem(`quran_progress`, JSON.stringify(progress));
}

export function clearQuranProgress() {
  localStorage.removeItem(`quran_progress`);
}
