
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getMovieGenres,
  getMoviesByGenre
} from '@/services/tmdbAPI';
import NavBar from '@/components/NavBar';
import ContentRow from '@/components/ContentRow';

const Movies = () => {
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

  // Fetch movie genres
  const { data: genres, isError: genresError } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: getMovieGenres,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch movies by genre - Action (genre ID 28)
  const { data: actionMoviesData, isError: actionMoviesError } = useQuery({
    queryKey: ['moviesByGenre', 28],
    queryFn: () => getMoviesByGenre(28),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch movies by genre - Comedy (genre ID 35)
  const { data: comedyMoviesData, isError: comedyMoviesError } = useQuery({
    queryKey: ['moviesByGenre', 35],
    queryFn: () => getMoviesByGenre(35),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch movies by genre - Drama (genre ID 18)
  const { data: dramaMoviesData, isError: dramaMoviesError } = useQuery({
    queryKey: ['moviesByGenre', 18],
    queryFn: () => getMoviesByGenre(18),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show error toast on API errors
  useEffect(() => {
    const errors = [
      popularMoviesError, 
      topRatedMoviesError, 
      genresError, 
      actionMoviesError, 
      comedyMoviesError, 
      dramaMoviesError
    ];
    
    if (errors.some(Boolean)) {
      toast.error('Error al cargar películas. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [
    popularMoviesError, 
    topRatedMoviesError, 
    genresError, 
    actionMoviesError, 
    comedyMoviesError, 
    dramaMoviesError
  ]);

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="pt-24 pb-20">
        <div className="px-6 mb-8">
          <h1 className="text-3xl font-bold">Películas</h1>
          <p className="text-streaming-text-secondary mt-2">
            Explora nuestra colección de películas
          </p>
        </div>
        
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
        
        {actionMoviesData?.results && actionMoviesData.results.length > 0 && (
          <ContentRow 
            title="Acción" 
            items={actionMoviesData.results} 
            type="movie" 
          />
        )}
        
        {comedyMoviesData?.results && comedyMoviesData.results.length > 0 && (
          <ContentRow 
            title="Comedia" 
            items={comedyMoviesData.results} 
            type="movie" 
          />
        )}
        
        {dramaMoviesData?.results && dramaMoviesData.results.length > 0 && (
          <ContentRow 
            title="Drama" 
            items={dramaMoviesData.results} 
            type="movie" 
          />
        )}
      </div>
    </div>
  );
};

export default Movies;
