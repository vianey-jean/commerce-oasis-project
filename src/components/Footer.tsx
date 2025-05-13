
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-shop-primary py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EshopElégant</h3>
            <p className="text-shop-primary-foreground">
              Your one-stop destination for all fashion and lifestyle products. Quality meets affordability.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-shop-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-shop-accent transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-shop-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-shop-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-shop-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-shop-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-shop-accent transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-shop-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Info</h4>
            <address className="not-italic space-y-2 text-shop-primary-foreground">
              <p>123 Commerce Street</p>
              <p>Shopville, SV 12345</p>
              <p>Email: info@eshopelegant.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p>© {new Date().getFullYear()} EshopElégant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
