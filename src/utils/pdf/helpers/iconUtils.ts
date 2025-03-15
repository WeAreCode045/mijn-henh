
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
// Import svg2pdf as a default import and rename to make it clear
import svg2pdfLib from 'svg2pdf.js';

// Map of icon names to FontAwesome icons
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
  size: number = 8
): Promise<void> => {
  try {
    // Get the icon from our map, or use calendar as fallback
    const iconDef = iconMap[iconName] || faCalendar;
    
    // Create FontAwesome icon
    const renderedIcon = icon(iconDef, { 
      styles: { 'color': 'white' } 
    });
    
    // Create SVG from icon
    const svgElement = document.createElement('div');
    svgElement.innerHTML = renderedIcon.html[0];
    const svg = svgElement.firstChild as SVGSVGElement;
    
    if (!svg) {
      console.error('Failed to create SVG element from icon:', iconName);
      return;
    }
    
    // Set size and position
    svg.setAttribute('width', `${size}px`);
    svg.setAttribute('height', `${size}px`);
    svg.setAttribute('viewBox', `0 0 ${iconDef.icon[0]} ${iconDef.icon[1]}`);
    
    // Save current state of PDF
    pdf.saveGraphicsState();
    
    // Position the icon
    const offsetX = x - size/2;
    const offsetY = y - size/2;
    
    // Use svg2pdfLib directly without calling .default
    await svg2pdfLib(svg, pdf, {
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
