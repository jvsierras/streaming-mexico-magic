
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import ContentCard from '@/components/ContentCard';
import { getMyList, getFavorites, removeFromMyList, removeFromFavorites, SavedContent } from '@/services/tmdbAPI';

const MyList = () => {
  const [myListContent, setMyListContent] = useState<SavedContent[]>([]);
  const [favoritesContent, setFavoritesContent] = useState<SavedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mylist");

  useEffect(() => {
    // Load saved content from local storage
    const loadSavedContent = () => {
      try {
        setMyListContent(getMyList());
        setFavoritesContent(getFavorites());
      } catch (error) {
        console.error('Error loading saved content:', error);
        toast.error('No se pudieron cargar tus contenidos guardados');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to simulate loading
    const timer = setTimeout(loadSavedContent, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromMyList = (id: number, type: 'movie' | 'tv') => {
    if (removeFromMyList(id, type)) {
      setMyListContent(prev => prev.filter(item => !(item.id === id && item.type === type)));
      toast.success('Se eliminó de Mi Lista');
    } else {
      toast.error('No se pudo eliminar de Mi Lista');
    }
  };

  const handleRemoveFromFavorites = (id: number, type: 'movie' | 'tv') => {
    if (removeFromFavorites(id, type)) {
      setFavoritesContent(prev => prev.filter(item => !(item.id === id && item.type === type)));
      toast.success('Se eliminó de Favoritos');
    } else {
      toast.error('No se pudo eliminar de Favoritos');
    }
  };

  const renderContentGrid = (
    content: SavedContent[], 
    isLoading: boolean, 
    removeHandler: (id: number, type: 'movie' | 'tv') => void,
    emptyMessage: string
  ) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-streaming-card rounded-lg aspect-[2/3]"></div>
              <div className="h-4 bg-streaming-card rounded mt-2 w-3/4"></div>
              <div className="h-3 bg-streaming-card rounded mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }
    
    if (content.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-xl text-streaming-text-secondary mb-4">No hay contenido guardado</p>
          <p className="text-streaming-text-secondary">{emptyMessage}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {content.map((item) => (
          <div key={`${item.type}-${item.id}`} className="relative group">
            <ContentCard 
              item={item.data} 
              type={item.type}
            />
            <button
              onClick={() => removeHandler(item.id, item.type)}
              className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contenido Guardado</h1>
          <p className="text-streaming-text-secondary mb-6">
            Tu colección de películas y series para ver más tarde
          </p>
          
          <Tabs defaultValue="mylist" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="mylist">Mi Lista</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mylist" className="mt-0">
              {renderContentGrid(
                myListContent, 
                isLoading, 
                handleRemoveFromMyList,
                "Agrega películas y series a tu lista para verlas más tarde"
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-0">
              {renderContentGrid(
                favoritesContent, 
                isLoading, 
                handleRemoveFromFavorites,
                "Marca películas y series como favoritas"
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyList;
