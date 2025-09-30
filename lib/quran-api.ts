import { ChapterResponse, ChaptersResponse, VersesResponse, Word } from "@/types/quran";

const BASE_URL = "http://localhost:3001/quran-api";
const cache = new Map<string, any>();
const MAX_VERSE_COUNT = 30; // Define a maximum verse count for filtering

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw new Error("Failed to fetch data from Quran API");
  }
}

export async function getChapters(): Promise<ChaptersResponse> {
  const response = await fetchWithCache<ChaptersResponse>(`${BASE_URL}/surahs`);

  const filterSimpleChapters: ChaptersResponse = {
    chapters: response.chapters.filter((chapter) => chapter.verses_count <= MAX_VERSE_COUNT),
  };

  return filterSimpleChapters;
}

export async function getChapter(chapterId: number): Promise<ChapterResponse> {
  return fetchWithCache(`${BASE_URL}/surahs/${chapterId}`);
}

export async function getVerses(chapterId: number, page = 1): Promise<VersesResponse> {
  const response = await fetchWithCache<VersesResponse>(
    `${BASE_URL}/verses-from-surah/${chapterId}?reciterId=7`
  );

  const filteredLastWord: VersesResponse = {
    verses: response.verses.map((verse) => {
      return {
        ...verse,
        words: verse.words.slice(0, -1), // Remove the last word (usually verse number)
      };
    }),
    pagination: response.pagination,
  };

  return filteredLastWord;
}

// Helper function to generate random word options for guessing game
export function generateWordOptions(correctWord: Word, allWords: Word[]): Word[] {
  const options = [correctWord];
  const availableWords = allWords.filter(
    (w) => w.id !== correctWord.id && w.text_uthmani !== correctWord.text_uthmani
  );

  // Add 3 random incorrect options
  while (options.length < 4 && availableWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const randomWord = availableWords.splice(randomIndex, 1)[0];
    options.push(randomWord);
  }

  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
}
