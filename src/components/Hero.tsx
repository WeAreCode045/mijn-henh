
import { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Subtle parallax effect
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${y * -2}deg) translateZ(10px)`;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-noise" id="hero">
      {/* Background subtle shapes */}
      <div className="shape-circle w-96 h-96 top-24 -left-48 opacity-10 animate-float"></div>
      <div className="shape-circle w-64 h-64 bottom-12 right-12 opacity-10 animate-pulse-subtle"></div>
      <div className="shape-square w-64 h-64 top-1/4 right-1/3 opacity-5 rotate-45 animate-float"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8 stagger-animation-container">
            <div className="chip animate-fade-in">Refined Elegance</div>
            
            <h1 className="heading-1 animate-fade-up max-w-xl">
              <span className="block">Craft Digital</span>
              <span className="block">Experiences with</span>
              <span className="block text-accent">Precision</span>
            </h1>
            
            <p className="paragraph-large max-w-md animate-fade-up">
              Discover a new standard in digital design. Every pixel meticulously considered to create experiences that inspire and delight.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
              <a href="#features" className="button-primary">
                Explore Features
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </a>
              <a href="#products" className="button-outline">
                View Products
              </a>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-radial from-gold-100/20 to-transparent animate-pulse-subtle"></div>
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1666919643134-d97687c1826c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Premium product showcase"
              className="w-full h-full object-cover rounded-2xl shadow-strong transition-all duration-700 animate-fade-in opacity-0"
              style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent rounded-2xl"></div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className="h-8 w-8" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
