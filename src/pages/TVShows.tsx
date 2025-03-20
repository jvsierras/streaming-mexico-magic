
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getPopularTVShows, 
  getTopRatedTVShows, 
  getTVGenres,
  getTVShowsByGenre
} from '@/services/tmdbAPI';
import NavBar from '@/components/NavBar';
import ContentRow from '@/components/ContentRow';

const TVShows = () => {
  // Fetch popular TV shows
  const { data: popularTVShowsData, isError: popularTVShowsError } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => getPopularTVShows(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch top rated TV shows
  const { data: topRatedTVShowsData, isError: topRatedTVShowsError } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: () => getTopRatedTVShows(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch TV genres
  const { data: genres, isError: genresError } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: getTVGenres,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch TV shows by genre - Drama (genre ID 18)
  const { data: dramaTVShowsData, isError: dramaTVShowsError } = useQuery({
    queryKey: ['tvShowsByGenre', 18],
    queryFn: () => getTVShowsByGenre(18),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch TV shows by genre - Comedy (genre ID 35)
  const { data: comedyTVShowsData, isError: comedyTVShowsError } = useQuery({
    queryKey: ['tvShowsByGenre', 35],
    queryFn: () => getTVShowsByGenre(35),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch TV shows by genre - Crime (genre ID 80)
  const { data: crimeTVShowsData, isError: crimeTVShowsError } = useQuery({
    queryKey: ['tvShowsByGenre', 80],
    queryFn: () => getTVShowsByGenre(80),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show error toast on API errors
  useEffect(() => {
    const errors = [
      popularTVShowsError, 
      topRatedTVShowsError, 
      genresError, 
      dramaTVShowsError, 
      comedyTVShowsError, 
      crimeTVShowsError
    ];
    
    if (errors.some(Boolean)) {
      toast.error('Error al cargar series. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [
    popularTVShowsError, 
    topRatedTVShowsError, 
    genresError, 
    dramaTVShowsError, 
    comedyTVShowsError, 
    crimeTVShowsError
  ]);

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="pt-24 pb-20">
        <div className="px-6 mb-8">
          <h1 className="text-3xl font-bold">Series</h1>
          <p className="text-streaming-text-secondary mt-2">
            Explora nuestra colección de series
          </p>
        </div>
        
        {popularTVShowsData?.results && popularTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Series Populares" 
            items={popularTVShowsData.results} 
            type="tv" 
          />
        )}
        
        {topRatedTVShowsData?.results && topRatedTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Series Mejor Valoradas" 
            items={topRatedTVShowsData.results} 
            type="tv" 
          />
        )}
        
        {dramaTVShowsData?.results && dramaTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Drama" 
            items={dramaTVShowsData.results} 
            type="tv" 
          />
        )}
        
        {comedyTVShowsData?.results && comedyTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Comedia" 
            items={comedyTVShowsData.results} 
            type="tv" 
          />
        )}
        
        {crimeTVShowsData?.results && crimeTVShowsData.results.length > 0 && (
          <ContentRow 
            title="Crimen" 
            items={crimeTVShowsData.results} 
            type="tv" 
          />
        )}
      </div>
    </div>
  );
};

export default TVShows;
