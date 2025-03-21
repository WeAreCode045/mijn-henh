
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface MediaViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
  type: "virtualTour" | "youtube";
}

export function MediaViewModal({
  open,
  onOpenChange,
  url,
  title,
  type,
}: MediaViewModalProps) {
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

  const embedUrl = type === "youtube" ? getEmbeddedYoutubeUrl(url) : url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 max-w-5xl h-[80vh] p-0">
        <DialogHeader className="p-4 flex-row justify-between items-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="w-full h-[calc(100%-4rem)] bg-gray-100">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
