export interface Flashcard {
  _id: string;
  set: string;
  word: string;
  translation: string;
  remember: boolean;
  repetitions: number;
  rememberedCount: number;
  updatedAt?: string;
}

export interface Language {
  name: string;
  flag: string;
}

export interface Deck {
  _id: string;
  name: string;
  description: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}

interface Progress {
  date: string;
  repetitions: number;
  streakUpdated: boolean;
}

export interface StudyStats {
  _id: string;
  dailyGoal: number;
  studyStreak: number;
  lastStudyDate?: string;
  progress?: Progress[];
}
