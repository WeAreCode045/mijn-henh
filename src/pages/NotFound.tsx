
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full text-center animate-fade-up">
        <div className="w-24 h-24 mx-auto bg-secondary/70 rounded-full flex items-center justify-center mb-8">
          <span className="text-6xl font-light">?</span>
        </div>
        <h1 className="heading-2 mb-4">404</h1>
        <p className="paragraph-large mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="button-primary inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
