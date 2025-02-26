
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 bg-secondary/30 border-t border-border/30 relative overflow-hidden">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <span className="text-lg font-medium text-foreground">Essence</span>
            </div>
            <p className="paragraph-small mb-6 max-w-xs">
              Dedicated to crafting premium digital experiences that blend 
              beauty with functionality.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              {["Twitter", "Instagram", "LinkedIn", "GitHub"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  aria-label={platform}
                >
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-4">Products</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Use Cases", "Releases"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors animated-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors animated-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              {["Support", "Documentation", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors animated-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Essence. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
