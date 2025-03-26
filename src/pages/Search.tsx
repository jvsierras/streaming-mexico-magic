
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { searchMulti } from '@/services/tmdbAPI';
import NavBar from '@/components/NavBar';
import ContentCard from '@/components/ContentCard';
import { Input } from '@/components/ui/input';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const query = searchParams.get('q') || '';
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMulti(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };
  
  // Show error toast on API errors
  useEffect(() => {
    if (isError) {
      toast.error('Error al buscar contenido. Por favor, inténtalo de nuevo más tarde.');
    }
  }, [isError]);
  
  const results = data?.results || [];
  const hasResults = results.length > 0;
  
  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Buscar Contenido</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12 max-w-xl">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar películas, series y más..."
                className="bg-streaming-card border-streaming-card focus-visible:ring-streaming-accent h-12 pl-12 text-base"
              />
              {isLoading ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-streaming-text-secondary animate-spin" />
              ) : (
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-streaming-text-secondary" />
              )}
            </div>
          </form>
          
          {/* Results */}
          {query && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">
                {isLoading ? 'Buscando...' : 
                  hasResults ? `Resultados para "${query}"` : `No se encontraron resultados para "${query}"`}
              </h2>
              
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-streaming-card rounded-lg aspect-[2/3]"></div>
                      <div className="h-4 bg-streaming-card rounded mt-2 w-3/4"></div>
                      <div className="h-3 bg-streaming-card rounded mt-2 w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : hasResults ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {results.filter(item => item.media_type === 'movie' || item.media_type === 'tv').map((item) => (
                    <div key={item.id}>
                      <ContentCard 
                        item={item} 
                        type={item.media_type === 'movie' ? 'movie' : 'tv'} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-streaming-text-secondary text-lg">
                    No encontramos nada que coincida con tu búsqueda. Intenta con otros términos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
