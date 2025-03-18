
/**
 * Safe property accessor that works with union types
 * For example, when you have string | PropertyImage and need to access a property
 * that only exists on PropertyImage
 */
export function getProperty<T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: any = undefined): any {
  if (!obj) return defaultValue;
  if (typeof obj !== 'object') return defaultValue;
  return (obj as any)[key] !== undefined ? (obj as any)[key] : defaultValue;
}

/**
 * Safe check if an object has a property
 */
export function hasProperty<T>(obj: T | null | undefined, key: string): boolean {
  if (!obj) return false;
  if (typeof obj !== 'object') return false;
  return key in (obj as any);
}

/**
 * Convert mixed type (string | Object) to a consistent object type
 */
export function ensureObject<T>(item: string | T, converter: (s: string) => T): T {
  if (typeof item === 'string') {
    return converter(item);
  }
  return item as T;
}
