
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import ContentCard from '@/components/ContentCard';
import { Movie, TVShow } from '@/services/tmdbAPI';

// This is a placeholder implementation for a "My List" feature
// In a real application, this would be connected to a backend service

type SavedContent = {
  id: number;
  type: 'movie' | 'tv';
  data: Movie | TVShow;
  addedAt: number;
};

const MyList = () => {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading saved content from local storage
    const loadSavedContent = () => {
      try {
        const savedItems = localStorage.getItem('myList');
        if (savedItems) {
          setSavedContent(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Error loading saved content:', error);
        toast.error('No se pudieron cargar tus contenidos guardados');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate network delay
    const timer = setTimeout(loadSavedContent, 1000);
    return () => clearTimeout(timer);
  }, []);

  const removeFromList = (id: number, type: 'movie' | 'tv') => {
    const updatedList = savedContent.filter(
      item => !(item.id === id && item.type === type)
    );
    setSavedContent(updatedList);
    
    try {
      localStorage.setItem('myList', JSON.stringify(updatedList));
      toast.success('Se eliminó de tu lista');
    } catch (error) {
      console.error('Error saving updated list:', error);
      toast.error('No se pudo eliminar de tu lista');
    }
  };

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mi Lista</h1>
          <p className="text-streaming-text-secondary mb-8">
            Tu colección de contenido guardado para ver más tarde
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-streaming-card rounded-lg aspect-[2/3]"></div>
                  <div className="h-4 bg-streaming-card rounded mt-2 w-3/4"></div>
                  <div className="h-3 bg-streaming-card rounded mt-2 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : savedContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {savedContent.map((item) => (
                <div key={`${item.type}-${item.id}`} className="relative group">
                  <ContentCard 
                    item={item.data} 
                    type={item.type}
                  />
                  <button
                    onClick={() => removeFromList(item.id, item.type)}
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
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-streaming-text-secondary mb-4">Tu lista está vacía</p>
              <p className="text-streaming-text-secondary">
                Agrega películas y series a tu lista para verlas más tarde
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
