// Quran API types
export interface Surah {
    id: number;
    revelation_place: string;
    revelation_order: number;
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    name_arabic: string;
    verses_count: number;
    pages: number[];
    translated_name: {
        language_name: string;
        name: string;
    };
}

export interface Word {
    id: number;
    position: number;
    audio_url: string | null;
    char_type_name: string;
    //code_v1: string;
    line_number: number;
    page_number: number;
    text: string;
    text_uthmani: string,
    text_indopak: string,
    text_uthmani_simple: string,
    location: string,
    translation?: {
        language_name: string;
        text: string;
    };
    transliteration?: {
        text: string | null;
        language_name: string;
    };
}

export interface Verse {
    id: number;
    verse_number: number;
    verse_key: string;
    hizb_number: number;
    rub_el_hizb_number: number;
    ruku_number: number;
    manzil_number: number;
    sajdah_number: number | null;
    text_uthmani: string;
    page_number: number;
    juz_number: number;
    words: Word[];
    translations?: Translation[];
    audio?: any;
}

export interface Translation {
    id: number;
    text: string;
    resource_id: number;
}

export interface ChapterResponse {
    chapter: Surah;
}

export interface ChaptersResponse {
    chapters: Surah[];
}

export interface VersesResponse {
    verses: Verse[];
    pagination: {
        per_page: number;
        current_page: number;
        next_page: number | null;
        total_pages: number;
        total_records: number;
    };
}

export interface WordsResponse {
    words: Word[];
    pagination: {
        per_page: number;
        current_page: number;
        next_page: number | null;
        total_pages: number;
        total_records: number;
    };
}

// App-specific types

export type VerseViewMode = 'memorizing' | 'completed' | 'review';

export interface WordGuessState {
    currentWordIndex: number;
    selectedOption: number | null;
    isCorrect: boolean | null;
    showResult: boolean;
    options: Word[];
    correctWord: Word;
}

export interface VerseProgress {
    verseNumber: number;
    isCompleted: boolean;
    currentWordIndex: number;
    totalWords: number;
}

export interface SurahProgress {
    surahId: number;
    currentVerseIndex: number;
    completedVerses: number[];
    verseProgresses: { [key: number]: VerseProgress };
}