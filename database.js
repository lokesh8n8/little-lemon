// Mock database with hardcoded menu data
const MOCK_MENU_ITEMS = [
  // Starters
  {
    id: 1,
    name: "Greek Salad",
    price: "12.99",
    description: "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
    image: "greekSalad.jpg",
    category: "starters"
  },
  {
    id: 2,
    name: "Bruschetta",
    price: "5.99",
    description: "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
    image: "bruschetta.jpg",
    category: "starters"
  },
  {
    id: 3,
    name: "Grilled Fish",
    price: "20.00",
    description: "Fish marinated in fresh herbs and grilled to perfection.",
    image: "grilledFish.jpg",
    category: "starters"
  },
  {
    id: 4,
    name: "Pasta",
    price: "6.99",
    description: "Penne with fried aubergines, cherry tomatoes, tomato sauce, fresh chilli, garlic, basil & salted ricotta cheese.",
    image: "pasta.jpg",
    category: "starters"
  },
  // Mains
  {
    id: 5,
    name: "Lemon Desert",
    price: "8.50",
    description: "Traditional homemade Italian Lemon Ricotta Cake.",
    image: "lemonDessert.jpg",
    category: "mains"
  },
  {
    id: 6,
    name: "Grilled Fish",
    price: "20.00",
    description: "Our signature grilled fish, served with seasonal vegetables and lemon herb sauce.",
    image: "grilledFish.jpg",
    category: "mains"
  },
  {
    id: 7,
    name: "Pasta",
    price: "18.99",
    description: "House special pasta with fresh seafood, cherry tomatoes, and white wine sauce.",
    image: "pasta.jpg",
    category: "mains"
  },
  {
    id: 8,
    name: "Pizza Margherita",
    price: "16.99",
    description: "Classic pizza with fresh mozzarella, tomato sauce, and basil.",
    image: "pizza.jpg",
    category: "mains"
  },
  {
    id: 9,
    name: "Mediterranean Lamb",
    price: "24.99",
    description: "Slow-cooked lamb with Mediterranean herbs and roasted vegetables.",
    image: "lamb.jpg",
    category: "mains"
  },
  // Desserts
  {
    id: 10,
    name: "Lemon Desert",
    price: "8.50",
    description: "Traditional homemade Italian Lemon Ricotta Cake.",
    image: "lemonDessert.jpg",
    category: "desserts"
  },
  {
    id: 11,
    name: "Tiramisu",
    price: "7.99",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    image: "tiramisu.jpg",
    category: "desserts"
  },
  {
    id: 12,
    name: "Baklava",
    price: "6.99",
    description: "Traditional Greek pastry with layers of phyllo dough, nuts, and honey syrup.",
    image: "baklava.jpg",
    category: "desserts"
  },
  {
    id: 13,
    name: "Gelato",
    price: "5.99",
    description: "Artisanal Italian gelato available in vanilla, chocolate, and pistachio flavors.",
    image: "gelato.jpg",
    category: "desserts"
  }
];

// Mock database functions with promises to maintain the same API
export const createTable = () => {
  return new Promise((resolve) => {
    // Mock table creation - always succeeds
    setTimeout(resolve, 100);
  });
};

export const saveMenuItems = (menuItems) => {
  return new Promise((resolve) => {
    // Mock save operation - always succeeds
    setTimeout(resolve, 100);
  });
};

export const getMenuItems = () => {
  return new Promise((resolve) => {
    // Return hardcoded menu items
    setTimeout(() => resolve([...MOCK_MENU_ITEMS]), 100);
  });
};

export const filterByQueryAndCategories = (query, activeCategories) => {
  return new Promise((resolve) => {
    let filteredItems = [...MOCK_MENU_ITEMS];

    // Filter by search query
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by categories
    if (activeCategories && activeCategories.length > 0) {
      filteredItems = filteredItems.filter(item =>
        activeCategories.includes(item.category)
      );
    }

    setTimeout(() => resolve(filteredItems), 100);
  });
};
