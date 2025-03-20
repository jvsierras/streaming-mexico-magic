
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Movie, TVShow, getImageUrl } from '@/services/tmdbAPI';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from './VideoPlayer';

interface HeroSectionProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

const HeroSection = ({ item, type }: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle backdrop image loading
  useEffect(() => {
    const img = new Image();
    img.src = getImageUrl(item.backdrop_path);
    img.onload = () => setIsLoading(false);
  }, [item.backdrop_path]);

  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] flex items-end overflow-hidden">
      <div 
        className={cn(
          "absolute inset-0 bg-streaming-card transition-opacity duration-1000",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
      
      <div 
        className={cn(
          "absolute inset-0 bg-center bg-cover transition-opacity duration-1000",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundImage: `url(${getImageUrl(item.backdrop_path)})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 space-y-6 animate-slide-up">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs md:text-sm font-medium text-streaming-accent tracking-wider animate-fade-in">
            {type === 'movie' ? 'PELÍCULA DESTACADA' : 'SERIE DESTACADA'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-shadow animate-slide-up" style={{ animationDelay: '100ms' }}>
            {title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-streaming-text-secondary animate-slide-up" style={{ animationDelay: '200ms' }}>
            <span className="font-semibold text-streaming-accent">
              {item.vote_average.toFixed(1)}
            </span>
            {year && <span>{year}</span>}
            <span className="h-1 w-1 rounded-full bg-streaming-text-secondary"></span>
            <span>Clasificación</span>
          </div>
        </div>
        
        <p className="max-w-2xl text-sm md:text-base text-streaming-text/90 line-clamp-3 md:line-clamp-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          {item.overview}
        </p>
        
        <div className="flex flex-wrap gap-4 pt-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
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
              <VideoPlayer tmdbId={item.id} type={type} />
            </DialogContent>
          </Dialog>
          
          <Link to={`/${type}/${item.id}`}>
            <Button 
              variant="secondary"
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white gap-2"
            >
              <Info className="w-5 h-5" />
              Más Información
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
