
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useShop } from "@/context/ShopContext";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const { state, dispatch } = useShop();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Set category from URL parameter if present
  useEffect(() => {
    if (categoryParam) {
      dispatch({ type: "SET_ACTIVE_CATEGORY", payload: categoryParam });
    }
  }, [categoryParam, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-gray-500">
            Browse our collection of {state.filteredProducts.length} products
          </p>
        </div>
        
        <CategoryFilter />
        
        {state.loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
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
        ) : state.filteredProducts.length > 0 ? (
          <div className="product-grid">
            {state.filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-gray-500 mt-2">
              Try changing your search or filter criteria
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
