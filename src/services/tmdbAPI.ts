// API key should be handled more securely in a production environment
// This is for demonstration purposes only
const API_KEY = '7787dd5dc689453346d1bca794089006';
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
  seasons: Season[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime?: number;
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

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> {
  return fetchFromTMDB<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
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

export interface SavedContent {
  id: number;
  type: 'movie' | 'tv';
  data: Movie | TVShow;
  addedAt: number;
}

export function addToMyList(content: Movie | TVShow, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('myList');
    let myList: SavedContent[] = savedItems ? JSON.parse(savedItems) : [];
    
    // Check if the item already exists
    const exists = myList.some(item => item.id === content.id && item.type === type);
    
    if (!exists) {
      myList.push({
        id: content.id,
        type,
        data: content,
        addedAt: Date.now()
      });
      
      localStorage.setItem('myList', JSON.stringify(myList));
    }
    
    return true;
  } catch (error) {
    console.error('Error adding to My List:', error);
    return false;
  }
}

export function removeFromMyList(id: number, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('myList');
    
    if (savedItems) {
      const myList: SavedContent[] = JSON.parse(savedItems);
      const updatedList = myList.filter(
        item => !(item.id === id && item.type === type)
      );
      
      localStorage.setItem('myList', JSON.stringify(updatedList));
    }
    
    return true;
  } catch (error) {
    console.error('Error removing from My List:', error);
    return false;
  }
}

export function isInMyList(id: number, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('myList');
    
    if (savedItems) {
      const myList: SavedContent[] = JSON.parse(savedItems);
      return myList.some(item => item.id === id && item.type === type);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking My List:', error);
    return false;
  }
}

export function addToFavorites(content: Movie | TVShow, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('favorites');
    let favorites: SavedContent[] = savedItems ? JSON.parse(savedItems) : [];
    
    // Check if the item already exists
    const exists = favorites.some(item => item.id === content.id && item.type === type);
    
    if (!exists) {
      favorites.push({
        id: content.id,
        type,
        data: content,
        addedAt: Date.now()
      });
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    return true;
  } catch (error) {
    console.error('Error adding to Favorites:', error);
    return false;
  }
}

export function removeFromFavorites(id: number, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('favorites');
    
    if (savedItems) {
      const favorites: SavedContent[] = JSON.parse(savedItems);
      const updatedList = favorites.filter(
        item => !(item.id === id && item.type === type)
      );
      
      localStorage.setItem('favorites', JSON.stringify(updatedList));
    }
    
    return true;
  } catch (error) {
    console.error('Error removing from Favorites:', error);
    return false;
  }
}

export function isInFavorites(id: number, type: 'movie' | 'tv'): boolean {
  try {
    const savedItems = localStorage.getItem('favorites');
    
    if (savedItems) {
      const favorites: SavedContent[] = JSON.parse(savedItems);
      return favorites.some(item => item.id === id && item.type === type);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking Favorites:', error);
    return false;
  }
}

export function getMyList(): SavedContent[] {
  try {
    const savedItems = localStorage.getItem('myList');
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error('Error getting My List:', error);
    return [];
  }
}

export function getFavorites(): SavedContent[] {
  try {
    const savedItems = localStorage.getItem('favorites');
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error('Error getting Favorites:', error);
    return [];
  }
}
