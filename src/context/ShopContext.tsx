
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// Define product type
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Define cart item type
export interface CartItem extends Product {
  quantity: number;
}

// Define the type for the shop state
interface ShopState {
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  categories: string[];
  searchQuery: string;
  activeCategory: string;
  loading: boolean;
}

// Define the types of actions
type ShopAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_FILTERED_PRODUCTS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_ACTIVE_CATEGORY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

// Define the initial state
const initialState: ShopState = {
  products: [],
  filteredProducts: [],
  cart: [],
  categories: [],
  searchQuery: "",
  activeCategory: "all",
  loading: true,
};

// Create a mock product array for the initial application
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    description: "A beautiful lightweight dress perfect for summer days. Made from 100% cotton with a floral pattern.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "clothing"
  },
  {
    id: 2,
    name: "Modern Coffee Table",
    description: "Minimalist coffee table with a solid wood top and metal legs. Perfect for any modern living room.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    category: "furniture"
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    category: "electronics"
  },
  {
    id: 4,
    name: "Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots and bill compartments.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    category: "accessories"
  },
  {
    id: 5,
    name: "Scented Candle Set",
    description: "Set of 3 luxury scented candles in vanilla, lavender, and sandalwood scents.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    category: "home"
  },
  {
    id: 6,
    name: "Cotton T-Shirt",
    description: "Classic fit cotton t-shirt available in various colors.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "clothing"
  },
  {
    id: 7,
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness settings.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    category: "furniture"
  },
  {
    id: 8,
    name: "Smartphone Case",
    description: "Durable smartphone case with shock absorption technology.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    category: "electronics"
  }
];

// Define the reducer function
const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_FILTERED_PRODUCTS":
      return { ...state, filteredProducts: action.payload };
    case "ADD_TO_CART": {
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
        toast.success(`Added another ${action.payload.name} to your cart`);
        return { ...state, cart: updatedCart };
      } else {
        toast.success(`Added ${action.payload.name} to your cart`);
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
    }
    case "REMOVE_FROM_CART":
      toast.info("Item removed from cart");
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case "UPDATE_QUANTITY": {
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, cart: updatedCart };
    }
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Create the context
const ShopContext = createContext<{
  state: ShopState;
  dispatch: React.Dispatch<ShopAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Custom hook to use the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

// Provider component
export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Initialize the shop with mock data
  useEffect(() => {
    // Simulate API call with a timeout
    const timer = setTimeout(() => {
      dispatch({ type: "SET_PRODUCTS", payload: mockProducts });
      dispatch({ type: "SET_FILTERED_PRODUCTS", payload: mockProducts });
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(mockProducts.map(product => product.category))
      );
      dispatch({ type: "SET_CATEGORIES", payload: uniqueCategories });
      dispatch({ type: "SET_LOADING", payload: false });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter products when search query or active category changes
  useEffect(() => {
    let filtered = state.products;

    // Filter by category
    if (state.activeCategory !== "all") {
      filtered = filtered.filter(product => product.category === state.activeCategory);
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filtered });
  }, [state.searchQuery, state.activeCategory, state.products]);

  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
};
