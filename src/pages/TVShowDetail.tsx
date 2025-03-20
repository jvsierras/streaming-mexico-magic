
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getTVShowDetails, 
  getTVShowCast, 
  getSimilarTVShows,
  getImageUrl
} from '@/services/tmdbAPI';
import NavBar from '@/components/NavBar';
import ContentRow from '@/components/ContentRow';
import TVShowSeasons from '@/components/TVShowSeasons';
import TVShowDetailHero from '@/components/TVShowDetailHero';
import CastSection from '@/components/CastSection';
import LoadingState from '@/components/LoadingState';

const TVShowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const tvId = parseInt(id || '0');

  // Fetch TV show details
  const { data: tvShow, isError: tvShowError } = useQuery({
    queryKey: ['tvShow', tvId],
    queryFn: () => getTVShowDetails(tvId),
    enabled: !!tvId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch TV show cast
  const { data: creditsData, isError: creditsError } = useQuery({
    queryKey: ['tvCredits', tvId],
    queryFn: () => getTVShowCast(tvId),
    enabled: !!tvId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch similar TV shows
  const { data: similarTVShows, isError: similarTVShowsError } = useQuery({
    queryKey: ['similarTVShows', tvId],
    queryFn: () => getSimilarTVShows(tvId),
    enabled: !!tvId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle backdrop image loading
  useEffect(() => {
    if (tvShow?.backdrop_path) {
      const img = new Image();
      img.src = getImageUrl(tvShow.backdrop_path);
      img.onload = () => setIsLoading(false);
    }
  }, [tvShow]);

  // Show error toast on API errors
  useEffect(() => {
    if (tvShowError || creditsError || similarTVShowsError) {
      toast.error('Error al cargar los detalles de la serie. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [tvShowError, creditsError, similarTVShowsError]);

  const cast = creditsData?.cast || [];

  if (!tvShow) {
    return <LoadingState message="Cargando detalles de la serie..." />;
  }

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      {/* Hero Section with Backdrop */}
      <TVShowDetailHero tvShow={tvShow} tvId={tvId} isLoading={isLoading} />
      
      {/* Seasons and Episodes */}
      <div className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {tvShow.seasons && tvShow.seasons.length > 0 && (
            <TVShowSeasons tvId={tvId} seasons={tvShow.seasons} />
          )}
        </div>
      </div>
      
      {/* Cast Section */}
      <CastSection cast={cast} />
      
      {/* Similar TV Shows */}
      {similarTVShows && similarTVShows.length > 0 && (
        <ContentRow 
          title="Series Similares" 
          items={similarTVShows} 
          type="tv" 
        />
      )}
    </div>
  );
};

export default TVShowDetail;
