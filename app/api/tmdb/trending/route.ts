import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET() {
  try {
    const res = await fetch(`${TMDB_BASE}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to fetch trending movies");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
