
import React from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-gray-500 mb-8">Find exactly what you're looking for</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/products?category=clothing" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                  <div className="mb-4 h-16 flex items-center justify-center text-3xl text-shop-primary">
                    👕
                  </div>
                  <h3 className="font-medium">Clothing</h3>
                </div>
              </Link>
              
              <Link to="/products?category=furniture" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                  <div className="mb-4 h-16 flex items-center justify-center text-3xl text-shop-primary">
                    🛋️
                  </div>
                  <h3 className="font-medium">Furniture</h3>
                </div>
              </Link>
              
              <Link to="/products?category=electronics" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                  <div className="mb-4 h-16 flex items-center justify-center text-3xl text-shop-primary">
                    📱
                  </div>
                  <h3 className="font-medium">Electronics</h3>
                </div>
              </Link>
              
              <Link to="/products?category=accessories" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                  <div className="mb-4 h-16 flex items-center justify-center text-3xl text-shop-primary">
                    👜
                  </div>
                  <h3 className="font-medium">Accessories</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between bg-shop-primary/10 p-8 rounded-lg">
              <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                <p className="mb-4">Stay updated with our latest products and exclusive offers</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-2 rounded-md border flex-grow"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
                  alt="Newsletter"
                  className="rounded-md max-h-40 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
