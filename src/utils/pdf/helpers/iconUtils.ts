
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
import svg2pdf from 'svg2pdf.js';

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
    pdf.setCurrentTransformationMatrix([1, 0, 0, 1, x - size/2, y - size/2]);
    
    // Render SVG to PDF
    await svg2pdf(svg, pdf, {
      x: 0,
      y: 0,
      width: size,
      height: size
    });
    
    // Restore PDF state
    pdf.restoreGraphicsState();
  } catch (error) {
    console.error('Error rendering icon to PDF:', error);
  }
};
