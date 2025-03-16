
/**
 * Safely converts any value to a string
 * Handles undefined and null values by returning an empty string
 */
export const safeToString = (value: any): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

/**
 * Formats a price with Euro symbol and thousand separators
 * @param price Price as string or number
 * @returns Formatted price string
 */
export const formatPrice = (price?: string | number): string => {
  if (price === undefined || price === null) {
    return '';
  }
  
  // Convert to string and remove any non-numeric characters except decimal
  const numericPrice = String(price).replace(/[^\d.]/g, '');
  
  // Parse as number
  const priceNum = parseFloat(numericPrice);
  if (isNaN(priceNum)) return String(price);
  
  // Format with thousand separators using Dutch locale (uses periods for thousands)
  return '€ ' + priceNum.toLocaleString('nl-NL');
};
