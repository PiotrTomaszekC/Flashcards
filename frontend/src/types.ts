export interface Flashcard {
  _id: string;
  set: string;
  word: string;
  translation: string;
  remember: boolean;
  repetitions: number;
  rememberedCount: number;
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
