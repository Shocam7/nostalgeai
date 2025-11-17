// pages/api/tmdb-proxy.ts (or app/api/tmdb-proxy/route.ts for App Router)

import type { NextApiRequest, NextApiResponse } from 'next';

const TMDB_API_KEY = '773be65506318f1d2770bfb578f0fda1';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { year, page = 1 } = req.query;

  // Validate year parameter
  if (!year || typeof year !== 'string') {
    return res.status(400).json({ error: 'Year parameter is required' });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=popularity.desc&page=${page}&language=en-US`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API returned ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match your interface
    const transformedResults = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: parseInt(year),
      popularity: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : undefined,
    }));

    return res.status(200).json({
      results: transformedResults,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (error) {
    console.error('TMDB proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch movies from TMDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
