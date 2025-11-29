import type { Order } from "../types/order.types";

// Mock coordinates for Budapest area
export const mockOrders: Order[] = [
  {
    id: "ord-001",
    userId: "user-123",
    restaurantId: "rest-001",
    restaurantName: "Pizza Paradise",
    restaurantLocation: {
      latitude: 47.4979,
      longitude: 19.0402,
      address: "Váci utca 10, Budapest",
    },
    items: [
      {
        menuItemId: "item-001",
        menuItemName: "Margherita Pizza",
        quantity: 2,
        price: 3200,
      },
      {
        menuItemId: "item-002",
        menuItemName: "Caesar Salad",
        quantity: 1,
        price: 2400,
      },
    ],
    totalPrice: 8800,
    status: "OUT_FOR_DELIVERY",
    deliveryAddress: "Andrássy út 22, Budapest",
    deliveryLocation: {
      latitude: 47.5035,
      longitude: 19.0566,
      address: "Andrássy út 22, Budapest",
    },
    courierLocation: {
      latitude: 47.5005,
      longitude: 19.0485,
      address: "Current location on route",
    },
    courierId: "courier-001",
    courierName: "John Courier",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    id: "ord-002",
    userId: "user-123",
    restaurantId: "rest-002",
    restaurantName: "Burger House",
    restaurantLocation: {
      latitude: 47.4925,
      longitude: 19.0514,
      address: "Kossuth Lajos utca 5, Budapest",
    },
    items: [
      {
        menuItemId: "item-003",
        menuItemName: "Classic Burger",
        quantity: 1,
        price: 2800,
      },
      {
        menuItemId: "item-004",
        menuItemName: "French Fries",
        quantity: 2,
        price: 900,
      },
      {
        menuItemId: "item-005",
        menuItemName: "Cola",
        quantity: 1,
        price: 500,
      },
    ],
    totalPrice: 5100,
    status: "PREPARING",
    deliveryAddress: "Dohány utca 15, Budapest",
    deliveryLocation: {
      latitude: 47.4965,
      longitude: 19.0621,
      address: "Dohány utca 15, Budapest",
    },
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    updatedAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
  },
  {
    id: "ord-003",
    userId: "user-123",
    restaurantId: "rest-003",
    restaurantName: "Sushi Master",
    restaurantLocation: {
      latitude: 47.5105,
      longitude: 19.0443,
      address: "Bajcsy-Zsilinszky út 30, Budapest",
    },
    items: [
      {
        menuItemId: "item-006",
        menuItemName: "California Roll",
        quantity: 2,
        price: 3900,
      },
      {
        menuItemId: "item-007",
        menuItemName: "Salmon Nigiri",
        quantity: 1,
        price: 3200,
      },
    ],
    totalPrice: 11000,
    status: "CONFIRMED",
    deliveryAddress: "Oktogon tér 3, Budapest",
    deliveryLocation: {
      latitude: 47.5055,
      longitude: 19.0625,
      address: "Oktogon tér 3, Budapest",
    },
    createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
  },
  {
    id: "ord-004",
    userId: "user-123",
    restaurantId: "rest-001",
    restaurantName: "Pizza Paradise",
    restaurantLocation: {
      latitude: 47.4979,
      longitude: 19.0402,
      address: "Váci utca 10, Budapest",
    },
    items: [
      {
        menuItemId: "item-008",
        menuItemName: "Pepperoni Pizza",
        quantity: 1,
        price: 3600,
      },
      {
        menuItemId: "item-009",
        menuItemName: "Garlic Bread",
        quantity: 1,
        price: 1200,
      },
    ],
    totalPrice: 4800,
    status: "DELIVERED",
    deliveryAddress: "Király utca 45, Budapest",
    deliveryLocation: {
      latitude: 47.4988,
      longitude: 19.0578,
      address: "Király utca 45, Budapest",
    },
    courierId: "courier-002",
    courierName: "Sarah Delivery",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 82800000).toISOString(), // ~23 hours ago
  },
  {
    id: "ord-005",
    userId: "user-123",
    restaurantId: "rest-004",
    restaurantName: "Taco Fiesta",
    restaurantLocation: {
      latitude: 47.4885,
      longitude: 19.0535,
      address: "Ráday utca 12, Budapest",
    },
    items: [
      {
        menuItemId: "item-010",
        menuItemName: "Chicken Tacos",
        quantity: 3,
        price: 1800,
      },
      {
        menuItemId: "item-011",
        menuItemName: "Guacamole",
        quantity: 1,
        price: 900,
      },
    ],
    totalPrice: 6300,
    status: "DELIVERED",
    deliveryAddress: "Andrássy út 22, Budapest",
    deliveryLocation: {
      latitude: 47.5035,
      longitude: 19.0566,
      address: "Andrássy út 22, Budapest",
    },
    courierId: "courier-003",
    courierName: "Mike Runner",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 169200000).toISOString(), // ~47 hours ago
  },
  {
    id: "ord-006",
    userId: "user-123",
    restaurantId: "rest-002",
    restaurantName: "Burger House",
    restaurantLocation: {
      latitude: 47.4925,
      longitude: 19.0514,
      address: "Kossuth Lajos utca 5, Budapest",
    },
    items: [
      {
        menuItemId: "item-012",
        menuItemName: "Double Cheeseburger",
        quantity: 1,
        price: 3400,
      },
    ],
    totalPrice: 3400,
    status: "CANCELLED",
    deliveryAddress: "Váci utca 50, Budapest",
    deliveryLocation: {
      latitude: 47.4945,
      longitude: 19.0512,
      address: "Váci utca 50, Budapest",
    },
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 258600000).toISOString(), // ~3 days ago
  },
  {
    id: "ord-007",
    userId: "user-456",
    restaurantId: "rest-001",
    restaurantName: "Pizza Paradise",
    restaurantLocation: {
      latitude: 47.4979,
      longitude: 19.0402,
      address: "Váci utca 10, Budapest",
    },
    items: [
      {
        menuItemId: "item-013",
        menuItemName: "Quattro Formaggi Pizza",
        quantity: 1,
        price: 3800,
      },
      {
        menuItemId: "item-014",
        menuItemName: "Tiramisu",
        quantity: 2,
        price: 1500,
      },
    ],
    totalPrice: 6800,
    status: "PENDING",
    deliveryAddress: "Deák Ferenc utca 8, Budapest",
    deliveryLocation: {
      latitude: 47.4972,
      longitude: 19.0533,
      address: "Deák Ferenc utca 8, Budapest",
    },
    createdAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    updatedAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "ord-008",
    userId: "user-789",
    restaurantId: "rest-001",
    restaurantName: "Pizza Paradise",
    restaurantLocation: {
      latitude: 47.4979,
      longitude: 19.0402,
      address: "Váci utca 10, Budapest",
    },
    items: [
      {
        menuItemId: "item-015",
        menuItemName: "Vegetarian Pizza",
        quantity: 2,
        price: 3400,
      },
    ],
    totalPrice: 6800,
    status: "PENDING",
    deliveryAddress: "Nagymező utca 12, Budapest",
    deliveryLocation: {
      latitude: 47.5025,
      longitude: 19.0588,
      address: "Nagymező utca 12, Budapest",
    },
    createdAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "ord-009",
    userId: "user-101",
    restaurantId: "rest-001",
    restaurantName: "Pizza Paradise",
    restaurantLocation: {
      latitude: 47.4979,
      longitude: 19.0402,
      address: "Váci utca 10, Budapest",
    },
    items: [
      {
        menuItemId: "item-001",
        menuItemName: "Margherita Pizza",
        quantity: 1,
        price: 3200,
      },
      {
        menuItemId: "item-002",
        menuItemName: "Caesar Salad",
        quantity: 1,
        price: 2400,
      },
      {
        menuItemId: "item-016",
        menuItemName: "Lemonade",
        quantity: 2,
        price: 600,
      },
    ],
    totalPrice: 6800,
    status: "PREPARING",
    deliveryAddress: "Wesselényi utca 25, Budapest",
    deliveryLocation: {
      latitude: 47.4985,
      longitude: 19.0645,
      address: "Wesselényi utca 25, Budapest",
    },
    createdAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
];
