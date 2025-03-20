
// API key should be handled more securely in a production environment
// This is for demonstration purposes only
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.themoviedb.org/3';

// Use TMDB's language parameter for Mexican Spanish
const LANGUAGE = 'es-MX';

interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  tagline: string;
  status: string;
  created_by: { id: number; name: string; profile_path: string | null }[];
}

// Helper function to make API requests
async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: LANGUAGE,
    ...params,
  }).toString();

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  
  return response.json();
}

// Movies
export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>('/trending/movie/day');
  return data.results;
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular', { page: page.toString() });
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/movie/top_rated', { page: page.toString() });
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/discover/movie', { 
    with_genres: genreId.toString(),
    page: page.toString(),
  });
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
}

export async function getMovieCast(movieId: number): Promise<{ cast: Cast[] }> {
  return fetchFromTMDB<{ cast: Cast[] }>(`/movie/${movieId}/credits`);
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${movieId}/similar`);
  return data.results;
}

// TV Shows
export async function getTrendingTVShows(): Promise<TVShow[]> {
  const data = await fetchFromTMDB<TMDBResponse<TVShow>>('/trending/tv/day');
  return data.results;
}

export async function getPopularTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/tv/popular', { page: page.toString() });
}

export async function getTopRatedTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/tv/top_rated', { page: page.toString() });
}

export async function getTVShowsByGenre(genreId: number, page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', { 
    with_genres: genreId.toString(),
    page: page.toString(),
  });
}

export async function getTVShowDetails(tvId: number): Promise<TVShowDetails> {
  return fetchFromTMDB<TVShowDetails>(`/tv/${tvId}`);
}

export async function getTVShowCast(tvId: number): Promise<{ cast: Cast[] }> {
  return fetchFromTMDB<{ cast: Cast[] }>(`/tv/${tvId}/credits`);
}

export async function getSimilarTVShows(tvId: number): Promise<TVShow[]> {
  const data = await fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${tvId}/similar`);
  return data.results;
}

// Genres
export async function getMovieGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

export async function getTVGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
  return data.genres;
}

// Search
export async function searchMulti(query: string, page = 1): Promise<TMDBResponse<(Movie | TVShow) & { media_type: 'movie' | 'tv' }>> {
  return fetchFromTMDB<TMDBResponse<(Movie | TVShow) & { media_type: 'movie' | 'tv' }>>('/search/multi', {
    query,
    page: page.toString(),
  });
}

// Image URLs
export function getImageUrl(path: string | null, size: string = 'original'): string {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
