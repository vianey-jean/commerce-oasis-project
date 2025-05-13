
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/context/ShopContext";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useShop();

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md">
      <Link to={`/product/${product.id}`}>
        <div className="h-64 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-medium hover:text-shop-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-sm mt-1">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={addToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
