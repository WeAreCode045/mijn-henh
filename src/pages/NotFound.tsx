
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-estate-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-estate-600 mb-6">Pagina niet gevonden</h2>
        <p className="text-gray-600 mb-8">
          De pagina die u probeerde te bezoeken bestaat niet of is verplaatst.
        </p>
        
        <div className="space-y-3">
          <Button asChild variant="default" className="w-full">
            <Link to="/" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Terug naar Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/properties" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Bekijk alle eigenschappen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
