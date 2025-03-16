
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
import { svg2pdf } from 'svg2pdf.js'; // Fixed import syntax
import { fetchSvgIcon } from '@/utils/iconService';

// Map of icon names to FontAwesome icons (fallback if SVG fetching fails)
const iconMap = {
  'calendar': faCalendar,
  'home': faHome,
  'ruler': faRuler,
  'bed': faBed,
  'bath': faBath,
  'zap': faBolt,
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
    // Try to fetch the SVG icon from storage using the centralized service
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
    
    // Set size for the SVG with padding
    const padding = 2; // Adding padding around the icon
    svg.setAttribute('width', `${size - padding}px`);
    svg.setAttribute('height', `${size - padding}px`);
    
    // Save current state of PDF
    pdf.saveGraphicsState();
    
    // Position the icon with adjustment for better vertical alignment
    const offsetX = x - size/2 + padding/2;
    const offsetY = y - size/2 - 0.5; // Slight upward adjustment for better alignment
    
    // Use svg2pdf correctly
    await svg2pdf(svg, pdf, {
      x: offsetX,
      y: offsetY,
      width: size - padding,
      height: size - padding
    });
    
    // Restore PDF state
    pdf.restoreGraphicsState();
  } catch (error) {
    console.error('Error rendering icon to PDF:', error);
  }
};
