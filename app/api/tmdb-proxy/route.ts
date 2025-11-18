import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const year = url.searchParams.get("year") || "";
  const region = url.searchParams.get("region") || "US";
  const page = url.searchParams.get("page") || "1";

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

  // ---- 1. Regional Movies ----
  const regionalData = await fetchJson(
    `https://api.themoviedb.org/3/discover/movie?` +
      new URLSearchParams({
        region,
        primary_release_year: year,
        include_adult: "false",    //  ⛔ BLOCK ADULT CONTENT
        sort_by: "popularity.desc",
        page
      })
  );

  // ---- 2. Global Movies ----
  const globalData = await fetchJson(
    `https://api.themoviedb.org/3/discover/movie?` +
      new URLSearchParams({
        primary_release_year: year,
        include_adult: "false",    //  ⛔ BLOCK ADULT CONTENT
        sort_by: "popularity.desc",
        page
      })
  );

  // ---- Combine ----
  let combined = [
    ...(regionalData.results || []),
    ...(globalData.results || [])
  ];

  // ---- Deduplicate ----
  const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());

  // ---- Sort ----
  unique.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json({ results: unique });
}
