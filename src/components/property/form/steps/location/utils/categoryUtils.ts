import { PropertyPlaceType, PropertyNearbyPlace } from "@/types/property";

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
export const getCategory = (place: PropertyNearbyPlace) => {
  const placeType = place.type.toLowerCase();
  
  if (placeType.includes('restaurant') || placeType.includes('cafe') || placeType.includes('bar') || placeType.includes('food')) {
    return 'restaurant';
  } else if (placeType.includes('school') || placeType.includes('education')) {
    return 'education';
  } else if (placeType.includes('hospital') || placeType.includes('doctor') || placeType.includes('clinic') || placeType.includes('health')) {
    return 'health';
  } else if (placeType.includes('store') || placeType.includes('shop') || placeType.includes('mall') || placeType.includes('supermarket')) {
    return 'shopping';
  } else if (placeType.includes('bus') || placeType.includes('train') || placeType.includes('transit') || placeType.includes('station')) {
    return 'transportation';
  } else if (placeType.includes('gym') || placeType.includes('sport') || placeType.includes('fitness') || placeType.includes('tennis') || placeType.includes('soccer') || placeType.includes('athletic')) {
    return 'sports';
  } else {
    return 'other';
  }
};

// Determine the transportation type from a place
export const getTransportationType = (place: PropertyNearbyPlace) => {
  const placeType = place.type.toLowerCase();
  if (placeType.includes('train')) {
    return 'Train';
  } else if (placeType.includes('bus')) {
    return 'Bus';
  } else if (placeType.includes('transit')) {
    return 'Transit';
  } else {
    return 'Station';
  }
};
