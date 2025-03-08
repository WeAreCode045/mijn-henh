
import { useState } from 'react';

export function useLocationCategories() {
  const [showCategories, setShowCategories] = useState<{[key: string]: boolean}>({
    education: true,
    sports: true,
    transportation: true,
    shopping: true,
    other: true
  });

  const toggleCategory = (e: React.MouseEvent, category: string) => {
    e.preventDefault(); // Prevent form submission
    setShowCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return {
    showCategories,
    toggleCategory
  };
}
