import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour cache

export async function GET(req: Request) {
  const url = new URL(req.url);

  const year = url.searchParams.get("year") || "";
  const region = url.searchParams.get("region") || "US";

  // Language mapping
  const countryToLanguage: Record<string, string[]> = {
    IN: ["hi", "ta", "te", "ml", "kn", "bn", "en"],
    FR: ["fr", "en"],
    DE: ["de", "en"],
    ES: ["es", "en"],
    IT: ["it", "en"],
    JP: ["ja", "en"],
    KR: ["ko", "en"],
    BR: ["pt", "en"],
    MX: ["es", "en"],
    PL: ["pl", "en"],
    NL: ["nl", "en"],
    SE: ["sv", "en"],
    AR: ["es", "en"],
    CN: ["zh", "en"],
    RU: ["ru", "en"],
    TR: ["tr", "en"],
    US: ["en"],
    GB: ["en"],
    CA: ["en", "fr"],
    AU: ["en"],
  };

  // Get languages for that region
  const languages = countryToLanguage[region] || ["en"];

  const headers = {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    Accept: "application/json",
  };

  async function fetchJson(url: string) {
    try {
      const r = await fetch(url, { headers, cache: "no-store" });
      return await r.json();
    } catch (err) {
      console.error("Error fetching", url, err);
      return { results: [], total_pages: 0 };
    }
  }

  // ---- Auto-pagination function ----
  async function fetchAllPages(baseUrl: string) {
    const first = await fetchJson(`${baseUrl}&page=1`);
    const totalPages = Math.min(first.total_pages || 1, 20);

    let results = [...(first.results || [])];

    const promises = [];
    for (let p = 2; p <= totalPages; p++) {
      promises.push(fetchJson(`${baseUrl}&page=${p}`));
    }

    const pages = await Promise.all(promises);
    for (const pg of pages) {
      results.push(...(pg.results || []));
    }

    return results;
  }

  // -------------------------------
  // 1. Fetch movies for ALL languages (regional + English)
  // -------------------------------
  const seenIds = new Set<number>();
  let allMovies: any[] = [];

  for (const lang of languages) {
    const baseUrl =
      "https://api.themoviedb.org/3/discover/movie?" +
      new URLSearchParams({
        with_original_language: lang,
        primary_release_year: year,
        include_adult: "false",
        sort_by: "popularity.desc",
      }).toString();

    const movies = await fetchAllPages(baseUrl);

    console.log(`🌐 ${lang}: ${movies.length} movies for year ${year}`);
    
    // Add only unique movies
    for (const movie of movies) {
      if (!seenIds.has(movie.id)) {
        seenIds.add(movie.id);
        allMovies.push(movie);
      }
    }
  }

  console.log(`✅ Total unique movies after deduplication: ${allMovies.length}`);

  // -------------------------------
  // 2. Sort by popularity
  // -------------------------------
  allMovies.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json({
    total: allMovies.length,
    results: allMovies,
  });
}
