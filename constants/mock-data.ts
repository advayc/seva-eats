export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  deliveryFee: string;
  eta: string;
  rating: string;
  promo?: string;
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

export const categories: Category[] = [
  { id: 'convenience', name: 'Convenience', icon: 'storefront' },
  { id: 'alcohol', name: 'Alcohol', icon: 'local-bar' },
  { id: 'pet', name: 'Pet Supplies', icon: 'pets' },
  { id: 'flowers', name: 'Flowers', icon: 'local-florist' },
  { id: 'grocery', name: 'Grocery', icon: 'shopping-cart' },
  { id: 'american', name: 'American', icon: 'lunch-dining' },
  { id: 'specialty', name: 'Specialty', icon: 'category' },
  { id: 'takeout', name: 'Takeout', icon: 'takeout-dining' },
  { id: 'asian', name: 'Asian', icon: 'ramen-dining' },
  { id: 'ice-cream', name: 'Ice Cream', icon: 'icecream' },
  { id: 'halal', name: 'Halal', icon: 'restaurant' },
  { id: 'retail', name: 'Retail', icon: 'local-mall' },
  { id: 'caribbean', name: 'Caribbean', icon: 'set-meal' },
  { id: 'indian', name: 'Indian', icon: 'restaurant-menu' },
  { id: 'french', name: 'French', icon: 'bakery-dining' },
  { id: 'fast-food', name: 'Fast Foods', icon: 'fastfood' },
  { id: 'burger', name: 'Burger', icon: 'lunch-dining' },
  { id: 'ride', name: 'Ride', icon: 'directions-car' },
  { id: 'chinese', name: 'Chinese', icon: 'ramen-dining' },
  { id: 'dessert', name: 'Dessert', icon: 'cake' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'adenine-kitchen',
    name: 'Adenine Kitchen',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    deliveryFee: '$0.29 Delivery Fee',
    eta: '10-25 min',
    rating: '4.4',
    promo: '5 orders until $8 reward',
  },
  {
    id: 'cardinal-chips',
    name: 'Cardinal Chips',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    deliveryFee: '$0.29 Delivery Fee',
    eta: '10-25 min',
    rating: '4.3',
  },
];

export const storeSections: StoreSection[] = [
  {
    id: 'produce',
    title: 'Fruits & Vegetables',
    items: [
      {
        id: 'banana',
        name: 'Organic Banana',
        price: '$0.27',
        unit: '1 banana',
        image:
          'https://images.unsplash.com/photo-1574226516831-e1dff420e42e?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'avocado',
        name: 'Medium Hass Avocado',
        price: '$2.21',
        unit: '1 avocado',
        image:
          'https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'pepper',
        name: 'Large Hot Pepper',
        price: '$1.04',
        unit: '1 pepper',
        image:
          'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'beverages',
    title: 'Beverages',
    items: [
      {
        id: 'cola',
        name: 'Cola Zero Sugar',
        price: '$9.89',
        unit: '12 x 12 fl oz',
        image:
          'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'orange-juice',
        name: 'Simply Pulp Free Orange Juice',
        price: '$5.49',
        unit: '52 fl oz',
        image:
          'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'water',
        name: 'Spring Water',
        price: '$4.39',
        unit: '24 x 16.9 fl oz',
        image:
          'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
];
