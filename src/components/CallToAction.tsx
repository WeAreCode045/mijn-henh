
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CallToAction = () => {
  const [isInView, setIsInView] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Reset submission status after a delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="section-padding relative overflow-hidden bg-noise"
    >
      {/* Background elements */}
      <div className="shape-circle w-96 h-96 -top-48 -right-48 opacity-5"></div>
      <div className="shape-square w-72 h-72 bottom-1/4 -left-36 opacity-5 rotate-12"></div>
      
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <div className={cn(
              "chip mb-4 opacity-0",
              isInView && "animate-fade-in"
            )}>Get in Touch</div>
            
            <h2 className={cn(
              "heading-2 mb-6 opacity-0",
              isInView && "animate-fade-up"
            )} style={{animationDelay: '0.1s'}}>
              Ready to Experience Excellence?
            </h2>
            
            <p className={cn(
              "paragraph-large mb-8 opacity-0",
              isInView && "animate-fade-up"
            )} style={{animationDelay: '0.2s'}}>
              Connect with us to discover how our premium products can elevate your everyday experiences. 
              We're here to help you find the perfect solution.
            </p>
            
            <div className={cn(
              "space-y-4 mb-8 opacity-0",
              isInView && "animate-fade-up"
            )} style={{animationDelay: '0.3s'}}>
              {[
                "Premium quality guaranteed", 
                "Expert consultation", 
                "Dedicated support team"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className={cn(
            "relative p-8 bg-card rounded-xl border border-border/40 shadow-soft overflow-hidden opacity-0",
            isInView && "animate-fade-up"
          )} style={{animationDelay: '0.4s'}}>
            {/* Form inner glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sand-300/10 via-gold-200/5 to-sand-300/10 rounded-xl blur-xl opacity-50"></div>
            
            <div className="relative">
              <h3 className="text-xl font-medium mb-6">Send us a message</h3>
              
              {isSubmitted ? (
                <div className="bg-accent/10 p-4 rounded-lg text-center">
                  <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="button-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Send Message
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
