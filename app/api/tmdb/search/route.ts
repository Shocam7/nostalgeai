// app/api/tmdb/search/route.ts

import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!res.ok) throw new Error("Failed to search movies");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
