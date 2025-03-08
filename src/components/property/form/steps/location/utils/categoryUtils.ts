
import { PropertyPlaceType } from "@/types/property";

// Color mapping for different place categories
export const getCategoryColor = (type: string) => {
  const colors: Record<string, string> = {
    restaurant: "bg-red-100 text-red-800",
    school: "bg-blue-100 text-blue-800",
    university: "bg-indigo-100 text-indigo-800",
    hospital: "bg-green-100 text-green-800",
    store: "bg-yellow-100 text-yellow-800",
    supermarket: "bg-orange-100 text-orange-800",
    transit_station: "bg-purple-100 text-purple-800",
    bus_station: "bg-violet-100 text-violet-800",
    train_station: "bg-fuchsia-100 text-fuchsia-800",
    park: "bg-emerald-100 text-emerald-800",
    gym: "bg-pink-100 text-pink-800",
    fitness: "bg-pink-100 text-pink-800",
    sports: "bg-sky-100 text-sky-800",
    default: "bg-gray-100 text-gray-800",
  };
  
  return colors[type] || colors.default;
};

// Determine the main category for a place
export const getCategory = (place: PropertyPlaceType) => {
  const type = place.type.toLowerCase();
  
  if (type.includes('restaurant') || type.includes('cafe') || type.includes('bar') || type.includes('food')) {
    return 'restaurant';
  } else if (type.includes('school') || type.includes('education')) {
    return 'education';
  } else if (type.includes('hospital') || type.includes('doctor') || type.includes('clinic') || type.includes('health')) {
    return 'health';
  } else if (type.includes('store') || type.includes('shop') || type.includes('mall') || type.includes('supermarket')) {
    return 'shopping';
  } else if (type.includes('bus') || type.includes('train') || type.includes('transit') || type.includes('station')) {
    return 'transportation';
  } else if (type.includes('gym') || type.includes('sport') || type.includes('fitness') || type.includes('tennis') || type.includes('soccer') || type.includes('athletic')) {
    return 'sports';
  } else {
    return 'other';
  }
};

// Determine the transportation type from a place
export const getTransportationType = (place: PropertyPlaceType) => {
  const type = place.type.toLowerCase();
  if (type.includes('train')) {
    return 'Train';
  } else if (type.includes('bus')) {
    return 'Bus';
  } else if (type.includes('transit')) {
    return 'Transit';
  } else {
    return 'Station';
  }
};
