
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-shop-primary/10 to-shop-accent/10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Our Latest Collections
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Explore our handpicked items crafted for quality and style. Find the perfect addition to your collection today.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg">
              New Arrivals
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block absolute right-0 bottom-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9')] bg-cover bg-center" />
    </div>
  );
};

export default Hero;
