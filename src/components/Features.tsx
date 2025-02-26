
import { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, MousePointerClick, Lightbulb, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  delay: number
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={cn(
        "elevated-card p-8 group transition-all duration-700 ease-out-expo opacity-0 translate-y-6",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="w-12 h-12 rounded-full bg-secondary/70 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
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

  const features = [
    {
      icon: Sparkles,
      title: "Premium Craftsmanship",
      description: "Meticulously designed elements that reflect quality and attention to detail in every interaction."
    },
    {
      icon: MousePointerClick,
      title: "Intuitive Interactions",
      description: "Thoughtfully engineered interfaces that anticipate user needs and provide seamless experiences."
    },
    {
      icon: Lightbulb,
      title: "Considered Design",
      description: "A design philosophy that balances aesthetics with functionality to create meaningful experiences."
    },
    {
      icon: Layers,
      title: "Cohesive System",
      description: "A unified design language that ensures consistency and harmony across all touchpoints."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="section-padding relative overflow-hidden bg-noise"
    >
      {/* Background elements */}
      <div className="shape-circle w-96 h-96 -bottom-48 -left-48 opacity-5"></div>
      <div className="shape-square w-72 h-72 top-1/4 -right-36 opacity-5 rotate-12"></div>
      
      <div className="container mx-auto container-padding">
        <div className="max-w-xl mx-auto text-center mb-16">
          <div className={cn(
            "chip mb-4 mx-auto opacity-0",
            isInView && "animate-fade-in"
          )}>
            <Check className="mr-1 h-3 w-3" /> Premium Features
          </div>
          
          <h2 className={cn(
            "heading-2 mb-6 opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.1s'}}>
            Designed for Excellence
          </h2>
          
          <p className={cn(
            "paragraph-large opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.2s'}}>
            Crafted with precision and care, our features set a new standard for what technology should be: 
            beautiful, intuitive, and meaningful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
        
        {/* Feature highlight */}
        <div className={cn(
          "mt-24 p-6 md:p-12 rounded-2xl bg-secondary/50 border border-border/40 opacity-0",
          isInView && "animate-fade-up"
        )} style={{animationDelay: '0.4s'}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-3 mb-4">Precision in Every Detail</h3>
              <p className="paragraph mb-6">
                Great design is born from careful consideration of every element. We've refined each component 
                to create a harmonious system that delivers exceptional experiences consistently.
              </p>
              <ul className="space-y-3">
                {["Thoughtfully crafted interactions", "Harmonious visual language", "Elegant animations", "Consistent patterns"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-accent mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Premium craftsmanship"
                className="w-full h-full object-cover scale-hover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
