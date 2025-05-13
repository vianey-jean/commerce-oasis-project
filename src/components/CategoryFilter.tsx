
import React from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/ShopContext";

const CategoryFilter: React.FC = () => {
  const { state, dispatch } = useShop();
  
  const setCategory = (category: string) => {
    dispatch({ type: "SET_ACTIVE_CATEGORY", payload: category });
  };

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-2">
        <Button
          variant={state.activeCategory === "all" ? "default" : "outline"}
          onClick={() => setCategory("all")}
          className="whitespace-nowrap"
        >
          All Products
        </Button>
        
        {state.categories.map((category) => (
          <Button
            key={category}
            variant={state.activeCategory === category ? "default" : "outline"}
            onClick={() => setCategory(category)}
            className="whitespace-nowrap"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
