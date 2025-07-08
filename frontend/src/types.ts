export interface Flashcard {
  id: number;
  word: string;
  translation: string;
  category: "Animals" | "Transport" | "House" | "Colors" | "Numbers";
  remember: boolean;
}
