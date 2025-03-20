
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie, TVShow, getImageUrl } from '@/services/tmdbAPI';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface ContentCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  priority?: boolean;
}

const ContentCard = ({ item, type, priority = false }: ContentCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  return (
    <Link 
      to={`/${type}/${item.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg relative" style={{ aspectRatio: '2/3' }}>
        <div 
          className={cn(
            "absolute inset-0 bg-streaming-card rounded-lg transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        
        <img 
          src={getImageUrl(item.poster_path, 'w500')} 
          alt={title}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full h-full object-cover rounded-lg transition-all duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            "group-hover:scale-105"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlay on hover */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <PlayCircle className="w-12 h-12 text-white opacity-90 transform transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      <div className="mt-2 space-y-1 px-1">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-streaming-text-secondary">
          <span className="text-streaming-accent font-medium">
            {item.vote_average.toFixed(1)}
          </span>
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
