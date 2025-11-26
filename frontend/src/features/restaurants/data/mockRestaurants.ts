import type { RestaurantProfile } from '../types/restaurant.types';

export const mockRestaurants: RestaurantProfile[] = [
  {
    restaurantName: 'Pizza Palace',
    openingHours: '11:00 - 22:00',
    menu: {
      items: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic tomato, mozzarella, and basil',
          price: 2500,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
        },
        {
          id: '2',
          name: 'Pepperoni Pizza',
          description: 'Spicy pepperoni with cheese',
          price: 3000,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        },
        {
          id: '3',
          name: 'Carbonara Pasta',
          description: 'Creamy pasta with bacon and egg',
          price: 2800,
          allergens: ['gluten', 'dairy', 'eggs'],
        },
      ],
    },
  },
  {
    restaurantName: 'Burger House',
    openingHours: '10:00 - 23:00',
    menu: {
      items: [
        {
          id: '4',
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, and cheese',
          price: 2200,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        },
        {
          id: '5',
          name: 'Cheeseburger',
          description: 'Double cheese, double beef',
          price: 2800,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
        },
        {
          id: '6',
          name: 'French Fries',
          description: 'Crispy golden fries',
          price: 800,
          allergens: [],
        },
      ],
    },
  },
  {
    restaurantName: 'Sushi Master',
    openingHours: '12:00 - 21:00',
    menu: {
      items: [
        {
          id: '7',
          name: 'California Roll',
          description: 'Crab, avocado, and cucumber',
          price: 3200,
          allergens: ['fish', 'soy'],
          imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        },
        {
          id: '8',
          name: 'Salmon Nigiri',
          description: 'Fresh salmon on rice',
          price: 2500,
          allergens: ['fish', 'soy'],
          imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56',
        },
        {
          id: '9',
          name: 'Miso Soup',
          description: 'Traditional Japanese soup',
          price: 900,
          allergens: ['soy'],
        },
      ],
    },
  },
  {
    restaurantName: 'Taco Fiesta',
    openingHours: '11:00 - 22:00',
    menu: {
      items: [
        {
          id: '10',
          name: 'Beef Tacos',
          description: 'Three tacos with seasoned beef',
          price: 2400,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
        },
        {
          id: '11',
          name: 'Chicken Burrito',
          description: 'Large burrito with grilled chicken',
          price: 2800,
          allergens: ['gluten', 'dairy'],
          imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f',
        },
        {
          id: '12',
          name: 'Nachos Supreme',
          description: 'Loaded nachos with all toppings',
          price: 2000,
          allergens: ['dairy'],
        },
      ],
    },
  },
  {
    restaurantName: 'Pasta Paradiso',
    openingHours: '12:00 - 23:00',
    menu: {
      items: [
        {
          id: '13',
          name: 'Spaghetti Bolognese',
          description: 'Traditional meat sauce pasta',
          price: 2600,
          allergens: ['gluten'],
          imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
        },
        {
          id: '14',
          name: 'Penne Arrabbiata',
          description: 'Spicy tomato sauce',
          price: 2400,
          allergens: ['gluten'],
        },
        {
          id: '15',
          name: 'Tiramisu',
          description: 'Classic Italian dessert',
          price: 1500,
          allergens: ['gluten', 'dairy', 'eggs'],
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        },
      ],
    },
  },
];
