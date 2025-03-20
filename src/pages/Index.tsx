
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getPopularMovies, 
  getTopRatedMovies,
  getPopularTVShows,
  Movie,
  TVShow
} from '@/services/tmdbAPI';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ContentRow from '@/components/ContentRow';

const Index = () => {
  const [heroContent, setHeroContent] = useState<{ item: Movie | TVShow, type: 'movie' | 'tv' } | null>(null);

  // Fetch trending movies
  const { data: trendingMovies, isError: trendingMoviesError } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch trending TV shows
  const { data: trendingTVShows, isError: trendingTVShowsError } = useQuery({
    queryKey: ['trendingTVShows'],
    queryFn: getTrendingTVShows,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch popular movies
  const { data: popularMoviesData, isError: popularMoviesError } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => getPopularMovies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch top rated movies
  const { data: topRatedMoviesData, isError: topRatedMoviesError } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => getTopRatedMovies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch popular TV shows
  const { data: popularTVShowsData, isError: popularTVShowsError } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => getPopularTVShows(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Set hero content when data is available
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      // Select a random trending movie for the hero
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.length));
      setHeroContent({ 
        item: trendingMovies[randomIndex],
        type: 'movie'
      });
    } else if (trendingTVShows && trendingTVShows.length > 0) {
      // Fallback to a trending TV show
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingTVShows.length));
      setHeroContent({
        item: trendingTVShows[randomIndex],
        type: 'tv'
      });
    }
  }, [trendingMovies, trendingTVShows]);

  // Show error toast on API errors
  useEffect(() => {
    if (trendingMoviesError || trendingTVShowsError || popularMoviesError || topRatedMoviesError || popularTVShowsError) {
      toast.error('Error al cargar contenido. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [trendingMoviesError, trendingTVShowsError, popularMoviesError, topRatedMoviesError, popularTVShowsError]);

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      {/* Hero Section */}
      {heroContent && <HeroSection {...heroContent} />}
      
      {/* Content Sections */}
      <div className="pt-10 pb-20">
        {trendingMovies && trendingMovies.length > 0 && (
          <ContentRow 
            title="Películas Tendencia" 
            items={trendingMovies} 
            type="movie" 
          />
        )}
        
        {trendingTVShows && trendingTVShows.length > 0 && (
          <ContentRow 
            title="Series Tendencia" 
            items={trendingTVShows} 
            type="tv" 
          />
        )}
        
        {popularMoviesData?.results && popularMoviesData.results.length > 0 && (
          <ContentRow 
            title="Películas Populares" 
            items={popularMoviesData.results} 
            type="movie" 
          />
        )}
        
        {topRatedMoviesData?.results && topRatedMoviesData.results.length > 0 && (
          <ContentRow 
            title="Películas Mejor Valoradas" 
            items={topRatedMoviesData.results} 
            type="movie" 
          />
        )}
        
        {popularTVShowsData?.results && popularTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Series Populares" 
            items={popularTVShowsData.results} 
            type="tv" 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
