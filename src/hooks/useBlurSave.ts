
import { useState, useCallback } from "react";

/**
 * A hook that provides blur-based saving functionality
 * 
 * @param initialValue The initial value of the field
 * @param onSave Function to call when saving the field value
 * @returns Object with value, onChange, onBlur handlers, and setValue function
 */
export function useBlurSave<T>(
  initialValue: T,
  onSave: (value: T) => void
) {
  const [value, setValue] = useState<T>(initialValue);
  const [lastSavedValue, setLastSavedValue] = useState<T>(initialValue);
  
  // Update the internal value when initialValue changes from props
  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    setLastSavedValue(newValue);
  }, []);
  
  // Handler for input changes (updates local state only)
  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);
  
  // Handler for blur events (saves if value has changed)
  const handleBlur = useCallback(() => {
    // Only save if the value has actually changed
    if (JSON.stringify(value) !== JSON.stringify(lastSavedValue)) {
      onSave(value);
      setLastSavedValue(value);
    }
  }, [value, lastSavedValue, onSave]);
  
  return {
    value,
    setValue: updateValue,
    onChange: handleChange,
    onBlur: handleBlur
  };
}
