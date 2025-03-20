
import { useState, useEffect } from 'react';
import { Heart, Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Movie, 
  TVShow, 
  addToMyList, 
  removeFromMyList, 
  isInMyList,
  addToFavorites,
  removeFromFavorites,
  isInFavorites
} from '@/services/tmdbAPI';

interface ContentActionsProps {
  content: Movie | TVShow;
  type: 'movie' | 'tv';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const ContentActions = ({ 
  content, 
  type, 
  size = 'md', 
  showLabels = true,
  className = '' 
}: ContentActionsProps) => {
  const [isInList, setIsInList] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check initial state
  useEffect(() => {
    setIsInList(isInMyList(content.id, type));
    setIsFavorite(isInFavorites(content.id, type));
  }, [content.id, type]);

  const handleToggleMyList = () => {
    if (isInList) {
      if (removeFromMyList(content.id, type)) {
        setIsInList(false);
        toast.success('Eliminado de Mi Lista');
      } else {
        toast.error('Error al eliminar de Mi Lista');
      }
    } else {
      if (addToMyList(content, type)) {
        setIsInList(true);
        toast.success('Agregado a Mi Lista');
      } else {
        toast.error('Error al agregar a Mi Lista');
      }
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      if (removeFromFavorites(content.id, type)) {
        setIsFavorite(false);
        toast.success('Eliminado de Favoritos');
      } else {
        toast.error('Error al eliminar de Favoritos');
      }
    } else {
      if (addToFavorites(content, type)) {
        setIsFavorite(true);
        toast.success('Agregado a Favoritos');
      } else {
        toast.error('Error al agregar a Favoritos');
      }
    }
  };
  
  // Size configurations
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3',
    lg: 'h-11 px-4 text-base'
  };
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        className={`${sizeClasses[size]} bg-streaming-card/70 backdrop-blur-sm border-streaming-text/20 hover:bg-streaming-card text-streaming-text`}
        onClick={handleToggleMyList}
      >
        {isInList ? (
          <>
            <Check className={iconSize[size]} />
            {showLabels && <span>En Mi Lista</span>}
          </>
        ) : (
          <>
            <Plus className={iconSize[size]} />
            {showLabels && <span>Agregar a Mi Lista</span>}
          </>
        )}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className={`${sizeClasses[size]} bg-streaming-card/70 backdrop-blur-sm border-streaming-text/20 hover:bg-streaming-card text-streaming-text`}
        onClick={handleToggleFavorite}
      >
        <Heart className={`${iconSize[size]} ${isFavorite ? 'fill-streaming-accent text-streaming-accent' : ''}`} />
        {showLabels && (isFavorite ? <span>Favorito</span> : <span>Marcar como Favorito</span>)}
      </Button>
    </div>
  );
};

export default ContentActions;
