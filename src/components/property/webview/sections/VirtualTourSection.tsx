
import { WebViewSectionProps } from "../types";
import "../styles/WebViewStyles.css";

export function VirtualTourSection({ property }: WebViewSectionProps) {
  // Extract virtual tour and video URLs
  const virtualTourUrl = property.virtualTourUrl || '';
  const youtubeUrl = property.youtubeUrl || '';
  
  // Check if content exists
  const hasVirtualTour = virtualTourUrl && virtualTourUrl.trim() !== '';
  const hasVideo = youtubeUrl && youtubeUrl.trim() !== '';
  
  // Format YouTube URL for embedding if needed
  const getEmbeddedYoutubeUrl = (url: string) => {
    if (!url) return '';
    
    try {
      // Handle different YouTube URL formats
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        // Short youtu.be links
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/watch')) {
        // Standard youtube.com links
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        // Already an embed link
        videoId = url.split('youtube.com/embed/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // If we can't parse it, return original URL
      return url;
    } catch (error) {
      console.error('Error formatting YouTube URL:', error);
      return url;
    }
  };
  
  const embeddedYoutubeUrl = getEmbeddedYoutubeUrl(youtubeUrl);
  
  // If no content available
  if (!hasVirtualTour && !hasVideo) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No virtual tour or video available for this property</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">Virtual Experience</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Virtual Tour */}
        {hasVirtualTour && (
          <div className="virtual-tour-container">
            <h3 className="text-lg font-semibold mb-3">Virtual Tour</h3>
            <div className="aspect-video rounded-lg overflow-hidden shadow-md">
              <iframe
                src={virtualTourUrl}
                title="Virtual Tour"
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* YouTube Video */}
        {hasVideo && (
          <div className="video-container">
            <h3 className="text-lg font-semibold mb-3">Property Video</h3>
            <div className="aspect-video rounded-lg overflow-hidden shadow-md">
              <iframe
                src={embeddedYoutubeUrl}
                title="Property Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
