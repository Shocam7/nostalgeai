// app/api/tmdb/filter/route.ts
import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const PAGES_TO_FETCH = 5;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const region = searchParams.get("region");
    const languages = searchParams.get("languages"); // comma separated, e.g., "en,fr"

    const fetches = [];
    for (let p = 1; p <= PAGES_TO_FETCH; p++) {
      const params = new URLSearchParams();
      if (year) params.append("primary_release_year", year);
      if (region) params.append("region", region);
      if (languages) params.append("with_original_language", languages);
      params.append("page", String(p));
      const url = `${TMDB_BASE}/discover/movie?${params.toString()}`;
      fetches.push(fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }));
    }

    const responses = await Promise.all(fetches);
    const jsons = await Promise.all(responses.map((r) => {
      if (!r.ok) throw new Error("TMDB discover fetch failed");
      return r.json();
    }));

    // merge
    const merged: any[] = [];
    for (const j of jsons) {
      if (Array.isArray(j.results)) merged.push(...j.results);
    }

    // dedupe
    const seen = new Map<number, any>();
    for (const m of merged) {
      if (!seen.has(m.id)) seen.set(m.id, m);
    }
    const unique = Array.from(seen.values());

    // For filters (no search query), relevance = normalized popularity
    const maxPop = unique.reduce((acc, mv) => Math.max(acc, mv.popularity ?? 0), 0) || 1;
    const items = unique.map((mv) => {
      const popularity_norm = (mv.popularity ?? 0) / maxPop;
      const relevance = popularity_norm;
      const score = popularity_norm * 0.3 + relevance * 0.7;
      return { ...mv, __score: score };
    });

    items.sort((a, b) => b.__score - a.__score);

    return NextResponse.json({ results: items });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
