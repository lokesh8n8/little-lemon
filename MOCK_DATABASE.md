# Mock Database Reference

## Overview
The Little Lemon app now uses a **mocked database** with hardcoded menu data instead of SQLite. This simplifies setup and removes external dependencies while maintaining the same API interface.

## Mock Data Structure

### Menu Item Schema
```javascript
{
  id: number,           // Unique identifier
  name: string,         // Dish name
  price: string,        // Price (formatted as string)
  description: string,  // Detailed description
  image: string,        // Image filename
  category: string      // Category: "starters", "mains", or "desserts"
}
```

### Current Mock Data (13 items)

#### Starters (4 items)
- Greek Salad ($12.99)
- Bruschetta ($5.99)
- Grilled Fish ($20.00)
- Pasta ($6.99)

#### Mains (5 items)
- Lemon Desert ($8.50)
- Grilled Fish ($20.00)
- Pasta ($18.99)
- Pizza Margherita ($16.99)
- Mediterranean Lamb ($24.99)

#### Desserts (4 items)
- Lemon Desert ($8.50)
- Tiramisu ($7.99)
- Baklava ($6.99)
- Gelato ($5.99)

## API Functions

All database functions return Promises to maintain compatibility:

### `createTable()`
- **Returns**: Promise that resolves after 100ms
- **Purpose**: Mock table creation (always succeeds)

### `getMenuItems()`
- **Returns**: Promise with array of all menu items
- **Purpose**: Get complete menu data

### `saveMenuItems(menuItems)`
- **Returns**: Promise that resolves after 100ms
- **Purpose**: Mock save operation (always succeeds)

### `filterByQueryAndCategories(query, activeCategories)`
- **Parameters**: 
  - `query`: Search string (searches name and description)
  - `activeCategories`: Array of category strings
- **Returns**: Promise with filtered menu items
- **Purpose**: Filter menu by search term and/or categories

## How to Modify Menu Data

1. **Edit `database.js`**
2. **Update the `MOCK_MENU_ITEMS` array**
3. **Follow the schema structure**
4. **Ensure unique IDs**

Example of adding a new item:
```javascript
{
  id: 14,
  name: "New Dish",
  price: "15.99",
  description: "A delicious new addition to our menu.",
  image: "newdish.jpg",
  category: "mains"
}
```

## Benefits of Mock Database

✅ **No external dependencies**  
✅ **Instant data loading**  
✅ **Works offline by default**  
✅ **Easy to test and develop**  
✅ **Simple to modify menu items**  
✅ **Same API for future real database**  

## Migration to Real Database

When ready to use a real database:

1. Keep the same function signatures
2. Replace the mock implementations
3. Add real database connection logic
4. No changes needed in React components
