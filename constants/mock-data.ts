// Seva action types - what users can do in the app
export type SevaAction = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

// Gurdwara/pickup locations
export type PickupLocation = {
  id: string;
  name: string;
  image: string;
  address: string;
  distance: string;
  boxesAvailable: number;
  nextLangar: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};

// Drop-off/recipient locations (from partner programs)
export type DropOffLocation = {
  id: string;
  name: string;
  type: 'shelter' | 'food_bank' | 'community_center' | 'family';
  address: string;
  distance: string;
  boxesNeeded: number;
  partnerProgram: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};

// Active delivery/dasher request
export type SevaRequest = {
  id: string;
  pickupLocation: PickupLocation;
  dropOffLocation: DropOffLocation;
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  boxCount: number;
  estimatedTime: string;
  distanceFromHome: string;
};

// Stats for the community
export type CommunityStats = {
  mealsDelivered: number;
  activeVolunteers: number;
  familiesServed: number;
  foodSavedKg: number;
};

// Main Seva actions available in the app
export const sevaActions: SevaAction[] = [
  {
    id: 'dasher',
    name: 'Sevadar Delivery',
    description: 'Pick up langar and deliver to a nearby household',
    icon: 'delivery-dining',
  },
  {
    id: 'find-gurdwara',
    name: 'Find a Gurdwara',
    description: 'Locate nearby pickup points with available meals',
    icon: 'location-on',
  },
  {
    id: 'view-routes',
    name: 'View Drop-off Routes',
    description: 'See delivery locations near partner sites',
    icon: 'route',
  },
  {
    id: 'track-delivery',
    name: 'Track Your Delivery',
    description: 'Monitor your active Seva delivery in real-time',
    icon: 'local-shipping',
  },
];

// Quick action categories for the home screen
export const quickActions: SevaAction[] = [
  {
    id: 'deliver-now',
    name: 'Deliver Now',
    description: 'Start a delivery right away',
    icon: 'directions-car',
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Plan for Friday Langar',
    icon: 'event',
  },
  {
    id: 'nearby',
    name: 'Nearby',
    description: 'Drop-offs near you',
    icon: 'near-me',
  },
  {
    id: 'history',
    name: 'My Seva',
    description: 'Your delivery history',
    icon: 'history',
  },
];

// Sample Gurdwara pickup locations
export const pickupLocations: PickupLocation[] = [
  {
    id: 'gurdwara-sahib-brampton',
    name: 'Gurdwara Sahib Brampton',
    image: 'https://images.unsplash.com/photo-1609947017136-9daf32a3d37e?q=80&w=1200&auto=format&fit=crop',
    address: '123 Sikh Way, Brampton, ON',
    distance: '2.3 km',
    boxesAvailable: 45,
    nextLangar: 'Friday, 6:00 PM',
    location: {
      latitude: 43.7315,
      longitude: -79.7624,
      address: '123 Sikh Way, Brampton, ON',
    },
  },
  {
    id: 'ontario-khalsa-darbar',
    name: 'Ontario Khalsa Darbar',
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=1200&auto=format&fit=crop',
    address: '7080 Dixie Road, Mississauga, ON',
    distance: '4.1 km',
    boxesAvailable: 62,
    nextLangar: 'Friday, 7:00 PM',
    location: {
      latitude: 43.6629,
      longitude: -79.6832,
      address: '7080 Dixie Road, Mississauga, ON',
    },
  },
  {
    id: 'gurdwara-dasmesh-darbar',
    name: 'Gurdwara Dasmesh Darbar',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200&auto=format&fit=crop',
    address: '2155 Derry Rd E, Mississauga, ON',
    distance: '5.8 km',
    boxesAvailable: 38,
    nextLangar: 'Friday, 6:30 PM',
    location: {
      latitude: 43.7066,
      longitude: -79.6441,
      address: '2155 Derry Rd E, Mississauga, ON',
    },
  },
];

// Sample drop-off locations (partner program recipients)
export const dropOffLocations: DropOffLocation[] = [
  {
    id: 'hope-shelter',
    name: 'Hope Community Shelter',
    type: 'shelter',
    address: '456 Main St, Brampton, ON',
    distance: '0.8 km from you',
    boxesNeeded: 12,
    partnerProgram: 'Peel Region Housing Support',
    location: {
      latitude: 43.7285,
      longitude: -79.7594,
      address: '456 Main St, Brampton, ON',
    },
  },
  {
    id: 'mississauga-food-bank',
    name: 'Mississauga Food Bank',
    type: 'food_bank',
    address: '3121 Universal Dr, Mississauga, ON',
    distance: '1.2 km from you',
    boxesNeeded: 25,
    partnerProgram: 'Feed Ontario Network',
    location: {
      latitude: 43.6459,
      longitude: -79.6121,
      address: '3121 Universal Dr, Mississauga, ON',
    },
  },
  {
    id: 'family-001',
    name: 'Family in Need',
    type: 'family',
    address: 'Near Hurontario & Dundas',
    distance: '1.5 km from you',
    boxesNeeded: 1,
    partnerProgram: 'Seva Family Support',
    location: {
      latitude: 43.5980,
      longitude: -79.6450,
      address: 'Hurontario & Dundas, Mississauga, ON',
    },
  },
];

// Sample available Seva requests
export const availableRequests: SevaRequest[] = [
  {
    id: 'seva-001',
    pickupLocation: pickupLocations[0],
    dropOffLocation: dropOffLocations[2],
    status: 'available',
    boxCount: 1,
    estimatedTime: '8 min',
    distanceFromHome: '1.5 km',
  },
  {
    id: 'seva-002',
    pickupLocation: pickupLocations[1],
    dropOffLocation: dropOffLocations[0],
    status: 'available',
    boxCount: 2,
    estimatedTime: '12 min',
    distanceFromHome: '0.8 km',
  },
];

// Community impact stats
export const communityStats: CommunityStats = {
  mealsDelivered: 12847,
  activeVolunteers: 342,
  familiesServed: 1893,
  foodSavedKg: 5420,
};

export type SevadarBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  color?: string;
};

export type GurdwaraLeaderboardEntry = {
  id: string;
  name: string;
  sevaHours: number;
  drops: number;
  onTimeRate: number;
};

export const sevadarStats = {
  sevaHours: 72,
  onTimeRate: 96,
  flawlessDrops: 10,
  shiftsCompleted: 67,
  familiesServed: 48,
  foodSavedKg: 136,
};

export const sevadarBadges: SevadarBadge[] = [
  {
    id: 'on-time-hero',
    title: 'On-Time Hero',
    description: 'Consistently on time for 10 deliveries',
    icon: 'schedule',
    achieved: true,
    color: '#3B82F6',
  },
  {
    id: 'flawless-drops',
    title: 'Flawless Drops',
    description: '10 perfect drop-offs',
    icon: 'verified',
    achieved: true,
    color: '#059669',
  },
  {
    id: 'seva-streak',
    title: 'Seva Streak',
    description: '4 weeks of active service',
    icon: 'local-fire-department',
    achieved: false,
    color: '#F97316',
  },
];

export const gurdwaraLeaderboard: GurdwaraLeaderboardEntry[] = [
  { id: 'g1', name: 'Gurdwara Sahib Brampton', sevaHours: 312, drops: 420, onTimeRate: 97 },
  { id: 'g2', name: 'Ontario Khalsa Darbar', sevaHours: 288, drops: 390, onTimeRate: 95 },
  { id: 'g3', name: 'Gurdwara Dasmesh Darbar', sevaHours: 241, drops: 318, onTimeRate: 94 },
];

// Legacy exports for backward compatibility (will be removed)
export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  deliveryNote: string;
  eta: string;
  rating: string;
  promo?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};

export type StoreSection = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    unit: string;
    image: string;
  }>;
};

// Map old categories to Seva-appropriate ones
export const categories: Category[] = [
  { id: 'dasher', name: 'Sevadars', icon: 'delivery-dining' },
  { id: 'gurdwaras', name: 'Gurdwaras', icon: 'location-on' },
  { id: 'routes', name: 'Routes', icon: 'route' },
  { id: 'schedule', name: 'Schedule', icon: 'event' },
  { id: 'shelters', name: 'Shelters', icon: 'night-shelter' },
  { id: 'food-banks', name: 'Food Banks', icon: 'food-bank' },
  { id: 'families', name: 'Families', icon: 'family-restroom' },
  { id: 'history', name: 'My Seva', icon: 'history' },
];

// Map old restaurants to pickup locations
export const restaurants: Restaurant[] = pickupLocations.map((loc) => ({
  id: loc.id,
  name: loc.name,
  image: loc.image,
  deliveryNote: `${loc.boxesAvailable} boxes available`,
  eta: loc.nextLangar,
  rating: loc.distance,
  location: loc.location,
}));

// Map old store sections to Langar items (free meals)
export const storeSections: StoreSection[] = [
  {
    id: 'langar-meals',
    title: 'Langar Meals Available',
    items: [
      {
        id: 'roti-dal',
        name: 'Roti & Dal Box',
        price: 'Free',
        unit: 'Serves 1 person',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'sabzi-rice',
        name: 'Sabzi & Rice Box',
        price: 'Free',
        unit: 'Serves 1 person',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'kheer-prasad',
        name: 'Kheer & Prasad',
        price: 'Free',
        unit: 'Sweet dessert',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
];
