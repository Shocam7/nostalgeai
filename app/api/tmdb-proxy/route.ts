import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const year = url.searchParams.get("year") || "";
  const region = url.searchParams.get("region") || "US";
  const page = url.searchParams.get("page") || "1";

  // Map country codes to primary languages
  const countryToLanguage: Record<string, string[]> = {
    'IN': ['hi', 'ta', 'te', 'ml', 'kn', 'bn'], // Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali
    'FR': ['fr'], // French
    'DE': ['de'], // German
    'ES': ['es'], // Spanish
    'IT': ['it'], // Italian
    'JP': ['ja'], // Japanese
    'KR': ['ko'], // Korean
    'BR': ['pt'], // Portuguese
    'MX': ['es'], // Spanish
    'PL': ['pl'], // Polish
    'NL': ['nl'], // Dutch
    'SE': ['sv'], // Swedish
    'AR': ['es'], // Spanish
    'CN': ['zh'], // Chinese
    'RU': ['ru'], // Russian
    'TR': ['tr'], // Turkish
    'US': ['en'], // English
    'GB': ['en'], // English
    'CA': ['en', 'fr'], // English, French
    'AU': ['en'], // English
  };

  const languages = countryToLanguage[region] || ['en'];

  const headers = {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    Accept: "application/json"
  };

  async function fetchJson(endpoint: string) {
    try {
      const res = await fetch(endpoint, { headers });
      return await res.json();
    } catch (e) {
      console.error("Fetch error:", endpoint, e);
      return { results: [] };
    }
  }

  // ---- 1. Regional Movies (by language) ----
  const regionalResults = [];
  
  for (const language of languages) {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/discover/movie?` +
        new URLSearchParams({
          with_original_language: language,
          primary_release_year: year,
          include_adult: "false",
          sort_by: "popularity.desc",
          page
        })
    );
    
    if (data.results) {
      regionalResults.push(...data.results);
    }
  }

  // ---- 2. Global Movies (English fallback) ----
  const globalData = await fetchJson(
    `https://api.themoviedb.org/3/discover/movie?` +
      new URLSearchParams({
        primary_release_year: year,
        include_adult: "false",
        sort_by: "popularity.desc",
        page
      })
  );

  // ---- Combine ----
  let combined = [
    ...regionalResults,
    ...(globalData.results || [])
  ];

  // ---- Deduplicate ----
  const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());

  // ---- Sort by popularity ----
  unique.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json({ results: unique });
}
