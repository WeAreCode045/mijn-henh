
export const findValue = (possiblePaths: string[], element: Element): string => {
  for (const path of possiblePaths) {
    const value = path.split("/").reduce((current: Element | null, tag: string) => {
      if (!current) return null;
      const elements = current.getElementsByTagName(tag);
      return elements.length > 0 ? elements[0] : null;
    }, element)?.textContent?.trim();
    
    if (value) return value;
  }
  return "";
};
