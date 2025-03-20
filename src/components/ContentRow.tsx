
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { Movie, TVShow } from '@/services/tmdbAPI';

interface ContentRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

const ContentRow = ({ title, items, type }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (!items.length) return null;

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="relative group">
        <div 
          ref={rowRef}
          className="content-carousel flex overflow-x-auto gap-4 px-6 pb-4 snap-x scroll-px-6"
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex-none w-[160px] md:w-[180px] snap-start"
            >
              <ContentCard 
                item={item} 
                type={type} 
                priority={index < 5}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button 
          className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
