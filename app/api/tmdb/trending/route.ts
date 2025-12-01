// app/api/tmdb/trending/route.ts
import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const PAGES_TO_FETCH = 5; // FetchPages: A => 5

// Simple Jaro-Winkler implementation (title-only mode — F1)
function jaroWinkler(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const m = matchingCharacters(s1, s2);
  if (m === 0) return 0;

  const t = transpositions(s1, s2) / 2;
  const jaro = (m / s1.length + m / s2.length + (m - t) / m) / 3;

  // Winkler boost
  let l = 0;
  const maxPrefix = 4;
  while (l < maxPrefix && s1[l] === s2[l]) l++;
  const p = 0.1;
  return jaro + l * p * (1 - jaro);
}

function matchingCharacters(s1: string, s2: string) {
  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  let matches = 0;
  const s2Matches = new Array(s2.length).fill(false);

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(s2.length - 1, i + matchDistance);
    for (let j = start; j <= end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
  }
  return matches;
}

function transpositions(s1: string, s2: string) {
  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  const s1Matches: string[] = [];
  const s2Matches: string[] = [];
  const s2Matched = new Array(s2.length).fill(false);

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(s2.length - 1, i + matchDistance);
    for (let j = start; j <= end; j++) {
      if (!s2Matched[j] && s1[i] === s2[j]) {
        s1Matches.push(s1[i]);
        s2Matches.push(s2[j]);
        s2Matched[j] = true;
        break;
      }
    }
  }

  let trans = 0;
  for (let i = 0; i < Math.min(s1Matches.length, s2Matches.length); i++) {
    if (s1Matches[i] !== s2Matches[i]) trans++;
  }
  return trans;
}

export async function GET(req: Request) {
  try {
    // No query expected for trending; we will fetch pages and use popularity as proxy relevance
    const fetches = [];
    for (let p = 1; p <= PAGES_TO_FETCH; p++) {
      const url = `${TMDB_BASE}/trending/movie/week?page=${p}`;
      fetches.push(fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }));
    }

    const responses = await Promise.all(fetches);
    const jsons = await Promise.all(responses.map((r) => {
      if (!r.ok) throw new Error("TMDB trending fetch failed");
      return r.json();
    }));

    // merge results
    const merged: any[] = [];
    for (const j of jsons) {
      if (Array.isArray(j.results)) merged.push(...j.results);
    }

    // dedupe by id
    const seen = new Map<number, any>();
    for (const m of merged) {
      if (!seen.has(m.id)) seen.set(m.id, m);
    }
    const unique = Array.from(seen.values());

    // normalize popularity to [0,1]
    const maxPop = unique.reduce((acc, mv) => Math.max(acc, mv.popularity ?? 0), 0) || 1;
    const items = unique.map((mv) => {
      const popularity_norm = (mv.popularity ?? 0) / maxPop;
      // For trending (no search), set relevance = popularity_norm (as per plan)
      const relevance = popularity_norm;
      const score = popularity_norm * 0.3 + relevance * 0.7; // ScoreFormula: C -> relevance-heavy (effectively same here)
      return { ...mv, __score: score };
    });

    items.sort((a, b) => b.__score - a.__score);

    return NextResponse.json({ results: items });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
              }
