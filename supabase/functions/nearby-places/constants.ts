
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Category configurations with includedTypes
export const categoryConfigs = {
  education: {
    includedTypes: ['preschool', 'primary_school', 'school', 'secondary_school', 'university'],
    maxResults: 20
  },
  entertainment: {
    includedTypes: ['zoo', 'tourist_attraction', 'park', 'night_club', 'movie_theater', 'event_venue', 'concert_hall'],
    maxResults: 20
  },
  shopping: {
    includedTypes: ['supermarket', 'shopping_mall'],
    maxResults: 20
  },
  sports: {
    includedTypes: ['arena', 'fitness_center', 'golf_course', 'gym', 'sports_complex', 'stadium', 'swimming_pool'],
    maxResults: 20
  }
};
