
import { icon } from '@fortawesome/fontawesome-svg-core';
import { 
  faCalendar, 
  faHome, 
  faRuler, 
  faBed, 
  faBath, 
  faBolt 
} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
// Import the svg2pdf library correctly
import * as svg2pdfLib from 'svg2pdf.js';
import { supabase } from '@/integrations/supabase/client';

// Map of icon names to FontAwesome icons (fallback if SVG fetching fails)
const iconMap = {
  'calendar': faCalendar,
  'home': faHome,
  'ruler': faRuler,
  'bed': faBed,
  'bath': faBath,
  'zap': faBolt,
};

// Cache for SVG icons to avoid repeated fetches
const svgCache: Record<string, string> = {};

// Fetch SVG from Supabase storage
const fetchSvgIcon = async (iconName: string, theme: 'light' | 'dark' = 'light'): Promise<string | null> => {
  // Check cache first
  const cacheKey = `${theme}-${iconName}`;
  if (svgCache[cacheKey]) {
    return svgCache[cacheKey];
  }
  
  try {
    const { data, error } = await supabase.storage
      .from('global')
      .download(`icons/${theme}/${iconName}.svg`);
      
    if (error || !data) {
      console.error(`Error fetching icon ${iconName}:`, error);
      return null;
    }
    
    const svgText = await data.text();
    // Cache the result
    svgCache[cacheKey] = svgText;
    return svgText;
  } catch (error) {
    console.error(`Error processing icon ${iconName}:`, error);
    return null;
  }
};

export const renderIconToPDF = async (
  pdf: jsPDF,
  iconName: string,
  x: number,
  y: number,
  size: number = 8,
  theme: 'light' | 'dark' = 'light'
): Promise<void> => {
  try {
    // Try to fetch the SVG icon from storage
    const svgContent = await fetchSvgIcon(iconName, theme);
    
    let svg: SVGSVGElement;
    
    if (svgContent) {
      // Create SVG element from the fetched content
      const svgElement = document.createElement('div');
      svgElement.innerHTML = svgContent;
      svg = svgElement.firstChild as SVGSVGElement;
      
      if (!svg) {
        throw new Error('Invalid SVG content');
      }
    } else {
      // Fallback to FontAwesome if SVG fetching fails
      const iconDef = iconMap[iconName] || faCalendar;
      const renderedIcon = icon(iconDef, { 
        styles: { 'color': 'white' } 
      });
      
      const svgElement = document.createElement('div');
      svgElement.innerHTML = renderedIcon.html[0];
      svg = svgElement.firstChild as SVGSVGElement;
      
      if (!svg) {
        throw new Error('Failed to create SVG element from icon');
      }
      
      // Set viewBox for FontAwesome icons
      svg.setAttribute('viewBox', `0 0 ${iconDef.icon[0]} ${iconDef.icon[1]}`);
    }
    
    // Set size for the SVG
    svg.setAttribute('width', `${size}px`);
    svg.setAttribute('height', `${size}px`);
    
    // Save current state of PDF
    pdf.saveGraphicsState();
    
    // Position the icon
    const offsetX = x - size/2;
    const offsetY = y - size/2;
    
    // Use svg2pdf correctly - it's now available as svg2pdfLib
    await svg2pdfLib.default(svg, pdf, {
      x: offsetX,
      y: offsetY,
      width: size,
      height: size
    });
    
    // Restore PDF state
    pdf.restoreGraphicsState();
  } catch (error) {
    console.error('Error rendering icon to PDF:', error);
  }
};
