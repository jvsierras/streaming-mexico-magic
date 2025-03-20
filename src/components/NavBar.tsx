
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Películas', path: '/movies' },
    { label: 'Series', path: '/tv' },
    { label: 'Mi Lista', path: '/mylist' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-streaming-background/90 backdrop-blur-md shadow-md' : 'bg-gradient-to-b from-streaming-background/80 to-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="font-bold text-2xl tracking-tight text-streaming-text"
          >
            StreamMX
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all hover:text-streaming-accent',
                  location.pathname === link.path 
                    ? 'text-streaming-accent' 
                    : 'text-streaming-text'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/search" 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-streaming-card/60 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link 
            to="/profile" 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-streaming-card/60 transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>
          
          <button 
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-streaming-card/60 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-streaming-background/95 backdrop-blur-md shadow-lg animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-base font-medium transition-all hover:text-streaming-accent px-2 py-1',
                  location.pathname === link.path 
                    ? 'text-streaming-accent' 
                    : 'text-streaming-text'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
