
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-streaming-background text-streaming-text">
      <NavBar />
      
      <div className="flex items-center justify-center px-6 min-h-screen">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-streaming-text-secondary mb-8">
            ¡Ups! No pudimos encontrar la página que estás buscando
          </p>
          <Link to="/">
            <Button 
              className="bg-streaming-accent hover:bg-streaming-accent/90 text-white gap-2"
              size="lg"
            >
              <Home className="w-5 h-5" />
              Regresar al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
