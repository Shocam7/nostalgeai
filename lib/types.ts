// lib/types.ts
export interface MemoryClass {
  id: string;
  name: string;
  svg: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  original_language: string;
  popularity: number;
}
