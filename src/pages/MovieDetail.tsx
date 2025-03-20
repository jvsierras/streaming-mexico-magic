import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Play, Clock, Calendar, Star, ArrowLeft } from 'lucide-react';
import { 
  getMovieDetails, 
  getMovieCast, 
  getSimilarMovies, 
  getImageUrl, 
  MovieDetails, 
  Cast,
  Movie
} from '@/services/tmdbAPI';
import { Button } from '@/components/ui/button';
import ContentRow from '@/components/ContentRow';
import NavBar from '@/components/NavBar';
import VideoPlayer from '@/components/VideoPlayer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const movieId = parseInt(id || '0');

  // Fetch movie details
  const { data: movie, isError: movieError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch movie cast
  const { data: creditsData, isError: creditsError } = useQuery({
    queryKey: ['movieCredits', movieId],
    queryFn: () => getMovieCast(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch similar movies
  const { data: similarMovies, isError: similarMoviesError } = useQuery({
    queryKey: ['similarMovies', movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle backdrop image loading
  useEffect(() => {
    if (movie?.backdrop_path) {
      const img = new Image();
      img.src = getImageUrl(movie.backdrop_path);
      img.onload = () => setIsLoading(false);
    }
  }, [movie]);

  // Show error toast on API errors
  useEffect(() => {
    if (movieError || creditsError || similarMoviesError) {
      toast.error('Error al cargar los detalles de la película. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [movieError, creditsError, similarMoviesError]);

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const cast = creditsData?.cast || [];

  if (!movie) {
    return (
      <div className="min-h-screen bg-streaming-background flex items-center justify-center">
        <div className="animate-pulse bg-streaming-card rounded-lg p-8">
          <p className="text-lg">Cargando detalles de la película...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      {/* Hero Section with Backdrop */}
      <div className="relative w-full" style={{ height: '70vh' }}>
        <div 
          className={`absolute inset-0 bg-streaming-card transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div 
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }}
        />
        
        <div className="absolute inset-0 hero-gradient" />
        
        <Link 
          to="/" 
          className="absolute top-24 left-6 z-20 flex items-center gap-2 text-white hover:text-streaming-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Regresar</span>
        </Link>
        
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="hidden md:block w-[220px] h-[330px] flex-shrink-0">
              <img 
                src={getImageUrl(movie.poster_path, 'w500')} 
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="flex-1 animate-slide-up">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-shadow">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="mt-2 text-lg italic text-streaming-text-secondary">{movie.tagline}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-streaming-text-secondary">
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  
                  {movie.runtime > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="bg-streaming-card/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm md:text-base text-streaming-text/90 max-w-3xl">
                  {movie.overview}
                </p>
                
                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-streaming-accent hover:bg-streaming-accent/90 text-white gap-2"
                        size="lg"
                      >
                        <Play className="w-5 h-5" />
                        Reproducir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl w-[95vw] p-1 sm:p-2 bg-black border-streaming-card">
                      <VideoPlayer tmdbId={movieId} type="movie" />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {cast.length > 0 && (
        <div className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Reparto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.slice(0, 6).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="overflow-hidden rounded-lg mb-2 aspect-square">
                    <img 
                      src={person.profile_path ? getImageUrl(person.profile_path, 'w300') : '/placeholder.svg'} 
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-1">
                    <p className="font-medium text-sm line-clamp-1">{person.name}</p>
                    <p className="text-xs text-streaming-text-secondary line-clamp-1">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {similarMovies && similarMovies.length > 0 && (
        <ContentRow 
          title="Películas Similares" 
          items={similarMovies} 
          type="movie" 
        />
      )}
    </div>
  );
};

export default MovieDetail;
