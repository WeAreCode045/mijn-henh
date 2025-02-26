
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo py-4 px-6 lg:px-12",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-soft" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="#" 
          className="text-xl font-medium tracking-tight"
          aria-label="Home"
        >
          <span className="sr-only">Brand</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary"></div>
            <span className="text-foreground">Essence</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Products', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 animated-underline"
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact"
            className="button-primary text-sm"
          >
            Get Started
          </a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-md z-40 transition-all duration-300 md:hidden",
          isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
          {['Products', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-lg text-foreground hover:text-accent transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact"
            className="button-primary mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
