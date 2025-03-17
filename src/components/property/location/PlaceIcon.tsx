
import React from 'react';
import { 
  Utensils, 
  School, 
  Hospital, 
  ShoppingBag, 
  Train, 
  Coffee, 
  Building, 
  User,
  Park
} from 'lucide-react';

interface PlaceIconProps {
  type: string;
  className?: string;
}

export function PlaceIcon({ type, className = "h-4 w-4" }: PlaceIconProps) {
  switch (type) {
    case 'restaurant':
    case 'food':
      return <Utensils className={className} />;
    case 'school':
    case 'education':
      return <School className={className} />;
    case 'hospital':
    case 'health':
    case 'doctor':
      return <Hospital className={className} />;
    case 'store':
    case 'shopping':
    case 'shop':
      return <ShoppingBag className={className} />;
    case 'transit':
    case 'train':
    case 'subway':
      return <Train className={className} />;
    case 'cafe':
    case 'bar':
      return <Coffee className={className} />;
    case 'park':
    case 'nature':
      return <Park className={className} />;
    case 'business':
    case 'office':
      return <Building className={className} />;
    default:
      return <User className={className} />;
  }
}
