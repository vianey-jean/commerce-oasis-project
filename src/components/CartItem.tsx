
import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/context/ShopContext";
import { useShop } from "@/context/ShopContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useShop();
  
  const removeFromCart = () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item.id });
  };
  
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, quantity: newQuantity }
    });
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.quantity - 1)}
            className="h-8 w-8"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="px-2">{item.quantity}</span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.quantity + 1)}
            className="h-8 w-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="ml-6 w-20 text-right">
          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={removeFromCart}
          className="ml-2 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
