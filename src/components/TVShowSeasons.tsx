
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play, Star } from 'lucide-react';
import { getSeasonEpisodes, Episode, Season, getImageUrl } from '@/services/tmdbAPI';
import VideoPlayer from '@/components/VideoPlayer';

interface TVShowSeasonsProps {
  tvId: number;
  seasons: Season[];
}

const TVShowSeasons = ({ tvId, seasons }: TVShowSeasonsProps) => {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Filter out specials (season 0)
  const filteredSeasons = seasons.filter(season => season.season_number > 0);

  // Sort seasons by season number
  const sortedSeasons = [...filteredSeasons].sort((a, b) => a.season_number - b.season_number);

  // Fetch episodes for expanded season
  const { data: seasonData, isLoading } = useQuery({
    queryKey: ['seasonEpisodes', tvId, expandedSeason],
    queryFn: () => expandedSeason !== null ? getSeasonEpisodes(tvId, expandedSeason) : null,
    enabled: expandedSeason !== null,
  });

  const handleSeasonClick = (seasonNumber: number) => {
    setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    
    return `${mins}m`;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Temporadas y Episodios</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {sortedSeasons.map((season) => (
          <AccordionItem key={season.id} value={`season-${season.season_number}`}>
            <AccordionTrigger 
              onClick={() => handleSeasonClick(season.season_number)}
              className="py-4 px-4 hover:bg-streaming-card/30 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="hidden sm:block w-[60px] h-[90px] flex-shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={getImageUrl(season.poster_path, 'w300')} 
                    alt={season.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium">
                    {season.name}
                  </h3>
                  <p className="text-sm text-streaming-text-secondary">
                    {season.episode_count} episodios • {season.air_date ? formatDate(season.air_date) : 'Fecha desconocida'}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pt-2 pb-4">
              {isLoading && expandedSeason === season.season_number ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="bg-streaming-card w-[120px] h-[68px] rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-streaming-card rounded w-3/4"></div>
                        <div className="h-3 bg-streaming-card rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {seasonData?.episodes?.map((episode) => (
                    <Collapsible key={episode.id} className="w-full">
                      <div className="flex gap-4 group">
                        <div className="relative w-[120px] h-[68px] flex-shrink-0 overflow-hidden rounded">
                          <img 
                            src={getImageUrl(episode.still_path, 'w300')} 
                            alt={episode.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Dialog>
                              <DialogTrigger asChild onClick={() => setSelectedEpisode(episode)}>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="rounded-full bg-streaming-accent/80 hover:bg-streaming-accent text-white border-none"
                                >
                                  <Play className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl w-[95vw] p-1 sm:p-2 bg-black border-streaming-card">
                                <VideoPlayer tmdbId={tvId} type="tv" seasonNumber={episode.season_number} episodeNumber={episode.episode_number} />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <CollapsibleTrigger className="text-left">
                              <h4 className="text-base font-medium group-hover:text-streaming-accent transition-colors">
                                {episode.episode_number}. {episode.name}
                              </h4>
                            </CollapsibleTrigger>
                            
                            <div className="flex items-center gap-2 text-xs text-streaming-text-secondary">
                              {episode.vote_average > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  {episode.vote_average.toFixed(1)}
                                </span>
                              )}
                              
                              {episode.runtime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatRuntime(episode.runtime)}
                                </span>
                              )}
                              
                              {episode.air_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(episode.air_date)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <CollapsibleContent>
                            <p className="text-sm text-streaming-text-secondary mt-2">
                              {episode.overview || "No hay descripción disponible para este episodio."}
                            </p>
                          </CollapsibleContent>
                        </div>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TVShowSeasons;
