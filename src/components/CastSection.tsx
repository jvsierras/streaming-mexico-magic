
import { Cast, getImageUrl } from '@/services/tmdbAPI';

interface CastSectionProps {
  cast: Cast[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  if (cast.length === 0) return null;
  
  return (
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
  );
};

export default CastSection;
