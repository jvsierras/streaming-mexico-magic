
import { Link } from 'react-router-dom';
import { Calendar, Star, ArrowLeft, Film, Play, X } from 'lucide-react';
import { TVShowDetails, getImageUrl } from '@/services/tmdbAPI';
import { Button } from '@/components/ui/button';
import ContentActions from '@/components/ContentActions';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import VideoPlayer from '@/components/VideoPlayer';

interface TVShowDetailHeroProps {
  tvShow: TVShowDetails;
  tvId: number;
  isLoading: boolean;
}

const TVShowDetailHero = ({ tvShow, tvId, isLoading }: TVShowDetailHeroProps) => {
  return (
    <div className="relative w-full" style={{ height: '70vh' }}>
      <div 
        className={`absolute inset-0 bg-streaming-card transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div 
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${getImageUrl(tvShow.backdrop_path)})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-24 left-6 z-20 flex items-center gap-2 text-white hover:text-streaming-accent transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Regresar</span>
      </Link>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block w-[220px] h-[330px] flex-shrink-0">
            <img 
              src={getImageUrl(tvShow.poster_path, 'w500')} 
              alt={tvShow.name}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Details */}
          <div className="flex-1 animate-slide-up">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-shadow">{tvShow.name}</h1>
                {tvShow.tagline && (
                  <p className="mt-2 text-lg italic text-streaming-text-secondary">{tvShow.tagline}</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-streaming-text-secondary">
                {tvShow.first_air_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Film className="w-4 h-4" />
                  <span>
                    {tvShow.number_of_seasons} {tvShow.number_of_seasons === 1 ? 'Temporada' : 'Temporadas'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{tvShow.vote_average.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="bg-streaming-card/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-sm md:text-base text-streaming-text/90 max-w-3xl">
                {tvShow.overview}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
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
                  <DialogContent 
                    className="max-w-6xl w-[95vw] p-1 sm:p-2 bg-black border-streaming-card"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                  >
                    <VideoPlayer tmdbId={tvId} type="tv" />
                  </DialogContent>
                </Dialog>
                
                <ContentActions 
                  content={tvShow} 
                  type="tv" 
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetailHero;
