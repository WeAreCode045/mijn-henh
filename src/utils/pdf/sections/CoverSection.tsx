
import React from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { getImageUrl } from "@/utils/imageUrlHelpers";

export const CoverSection = ({ property }: { property: PropertyData }) => {
  // Find the main image
  const mainImage = React.useMemo(() => {
    if (!property.images || property.images.length === 0) return null;
    
    // First, look for the explicitly marked main image
    const mainImg = property.images.find(img => 
      typeof img !== 'string' && (img as any).is_main
    );
    
    if (mainImg) return getImageUrl(mainImg);
    
    // If no main image is found, use the first image
    return getImageUrl(property.images[0]);
  }, [property.images]);
  
  // Get featured images (excluding the main image)
  const featuredImages = React.useMemo(() => {
    if (!property.images || property.images.length === 0) return [];
    
    return property.images
      .filter(img => typeof img !== 'string' && (img as any).is_featured_image)
      .map(img => getImageUrl(img))
      .filter(url => url !== mainImage)
      .slice(0, 3); // Limit to 3 featured images
  }, [property.images, mainImage]);
  
  return (
    <div className="pdf-section cover-section">
      <div className="property-header">
        <h1>{property.title}</h1>
        <h2>{property.price}</h2>
        <p>{property.address}</p>
      </div>
      
      <div className="cover-images">
        {mainImage && (
          <div className="main-image">
            <img src={mainImage} alt={property.title} />
          </div>
        )}
        
        {featuredImages.length > 0 && (
          <div className="featured-images">
            {featuredImages.map((url, i) => (
              <div className="featured-image" key={i}>
                <img src={url} alt={`${property.title} - Featured ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="property-summary">
        <div className="property-details">
          <div className="detail-item">
            <span className="label">Bedrooms</span>
            <span className="value">{property.bedrooms}</span>
          </div>
          <div className="detail-item">
            <span className="label">Bathrooms</span>
            <span className="value">{property.bathrooms}</span>
          </div>
          <div className="detail-item">
            <span className="label">Size</span>
            <span className="value">{property.sqft || property.livingArea} m²</span>
          </div>
        </div>
        
        {property.shortDescription && (
          <div className="short-description">
            <p>{property.shortDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};
