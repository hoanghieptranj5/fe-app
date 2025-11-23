// src/types/hanzi.ts
export interface HanziCharacter {
  character: string;
  hanViet: string;
  pinyin: string;
  cantonese: string;
  description: string | null;
}

export interface Flashcard {
  id: string;
  hanzi: string;
  pronunciations: string[];
}
