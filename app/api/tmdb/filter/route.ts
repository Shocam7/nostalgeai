import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year");
  const region = searchParams.get("region");
  const languages = searchParams.get("languages"); // comma separated, e.g., "en,fr"

  try {
    const params = new URLSearchParams();
    if (year) params.append("primary_release_year", year);
    if (region) params.append("region", region);
    if (languages) params.append("with_original_language", languages);

    // TMDB discover endpoint
    const res = await fetch(`${TMDB_BASE}/discover/movie?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to fetch filtered movies");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
