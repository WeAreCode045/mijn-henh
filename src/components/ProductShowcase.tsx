
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  description: string;
  rating: number;
  image: string;
  category: string;
}

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const products: Product[] = [
    {
      id: 1,
      name: "Minimalist Stand",
      description: "Elegant design meets functionality in this premium product stand.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "accessories"
    },
    {
      id: 2,
      name: "Premium Speaker",
      description: "Immersive sound quality wrapped in a timeless design.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "audio"
    },
    {
      id: 3,
      name: "Modern Timepiece",
      description: "A statement of precision and style for the discerning individual.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "accessories"
    },
    {
      id: 4,
      name: "Wireless Earbuds",
      description: "Exceptional audio performance with a seamless connection.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "audio"
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'audio', name: 'Audio' },
    { id: 'accessories', name: 'Accessories' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  return (
    <section 
      ref={sectionRef}
      id="products" 
      className="section-padding relative overflow-hidden bg-noise"
    >
      <div className="container mx-auto container-padding">
        <div className="max-w-xl mx-auto text-center mb-16">
          <div className={cn(
            "chip mb-4 mx-auto opacity-0",
            isInView && "animate-fade-in"
          )}>Our Collection</div>
          
          <h2 className={cn(
            "heading-2 mb-6 opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.1s'}}>
            Precision Crafted Products
          </h2>
          
          <p className={cn(
            "paragraph-large opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.2s'}}>
            Discover our collection of thoughtfully designed products that blend form and function in perfect harmony.
          </p>
        </div>
        
        {/* Category selector */}
        <div className={cn(
          "flex flex-wrap justify-center gap-2 mb-12 opacity-0",
          isInView && "animate-fade-up"
        )} style={{animationDelay: '0.3s'}}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all duration-200",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className={cn(
                "elevated-card overflow-hidden group opacity-0",
                isInView && "animate-fade-up"
              )}
              style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="chip text-xs">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                  <div className="flex items-center text-sm">
                    <Star className="w-3 h-3 text-gold-500 mr-1 fill-gold-500" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                <p className="paragraph-small mb-4">{product.description}</p>
                
                <a href="#contact" className="inline-flex items-center text-sm text-foreground hover:text-accent transition-colors duration-200 animated-underline">
                  Explore <ArrowRight className="ml-1 w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* View more products link */}
        <div className="text-center mt-12">
          <a href="#" className={cn(
            "button-outline inline-flex items-center opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.8s'}}>
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
