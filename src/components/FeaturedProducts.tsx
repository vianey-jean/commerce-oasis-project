
import React from "react";
import { useShop } from "@/context/ShopContext";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts: React.FC = () => {
  const { state } = useShop();
  
  // Show a subset of products (e.g., first 4) as featured products
  const featuredProducts = state.products.slice(0, 4);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
        <p className="text-gray-500 mb-8">Discover our most popular items handpicked for you</p>
        
        {state.loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-9 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
