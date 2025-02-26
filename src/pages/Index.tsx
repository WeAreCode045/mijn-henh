
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Offset for fixed header
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, '', anchor.hash);
        }
      }
    };

    // Add event listener for all clicks
    document.addEventListener('click', handleAnchorClick);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Preload images for better UX
  useEffect(() => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1666919643134-d97687c1826c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <ProductShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
