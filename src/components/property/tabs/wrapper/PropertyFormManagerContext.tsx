
import React, { createContext, useContext } from 'react';
import { PropertyFormManagerChildrenProps } from './types/PropertyFormManagerTypes';

const PropertyFormContext = createContext<PropertyFormManagerChildrenProps | undefined>(undefined);

export function usePropertyFormContext() {
  const context = useContext(PropertyFormContext);
  if (context === undefined) {
    throw new Error('usePropertyFormContext must be used within a PropertyFormManagerProvider');
  }
  return context;
}

interface PropertyFormManagerProviderProps {
  value: PropertyFormManagerChildrenProps;
  children: React.ReactNode;
}

export function PropertyFormManagerProvider({ value, children }: PropertyFormManagerProviderProps) {
  return (
    <PropertyFormContext.Provider value={value}>
      {children}
    </PropertyFormContext.Provider>
  );
}
