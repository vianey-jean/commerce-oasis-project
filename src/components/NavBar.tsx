
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/ShopContext";

const NavBar: React.FC = () => {
  const { state, dispatch } = useShop();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
  };
  
  // Calculate total items in cart
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 bg-white border-b z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-shop-primary">
            EshopElégant
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-shop-accent transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-shop-accent transition-colors">
              Products
            </Link>
            <Link to="/about" className="hover:text-shop-accent transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-shop-accent transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={state.searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-shop-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Button className="md:hidden" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="md:hidden mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={state.searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="md:hidden flex items-center justify-between mt-4 border-t pt-4">
          <Link to="/" className="text-center flex-1 hover:text-shop-accent">
            Home
          </Link>
          <Link to="/products" className="text-center flex-1 hover:text-shop-accent">
            Products
          </Link>
          <Link to="/about" className="text-center flex-1 hover:text-shop-accent">
            About
          </Link>
          <Link to="/contact" className="text-center flex-1 hover:text-shop-accent">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
