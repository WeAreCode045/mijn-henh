
/**
 * Helper function to safely convert JSON or array to array
 */
export const safeParseArray = (value: any, defaultValue: any[] = []): any[] => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  return defaultValue;
};
