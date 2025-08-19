
const fs = require('fs');
const path = require('path');
const EncryptionService = require('../utils/encryption');

const productsPath = path.join(__dirname, '../db/products.json');

const Product = {
  // Get all products
  getAll: () => {
    try {
      const data = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(data);
      console.log(`📦 Retrieved ${products.length} products from database`);
      // Décrypter les données sensibles
      return products.map(product => ({
        ...product,
        description: EncryptionService.decrypt(product.description),
        purchasePrice: EncryptionService.decrypt(product.purchasePrice),
        quantity: EncryptionService.decrypt(product.quantity)
      }));
    } catch (error) {
      console.error("❌ Error reading products:", error);
      return [];
    }
  },

  // Get product by ID
  getById: (id) => {
    try {
      const data = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(data);
      const product = products.find(product => product.id === id) || null;
      console.log(`🔍 Retrieved product by ID ${id}:`, product ? 'Found' : 'Not found');
      if (product) {
        // Décrypter les données sensibles
        product.description = EncryptionService.decrypt(product.description);
        product.purchasePrice = EncryptionService.decrypt(product.purchasePrice);
        product.quantity = EncryptionService.decrypt(product.quantity);
      }
      return product;
    } catch (error) {
      console.error("❌ Error finding product by id:", error);
      return null;
    }
  },

  // Search products by description
  search: (query) => {
    try {
      const data = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(data);
      if (!query || query.length < 3) return [];
      
      // Décrypter les descriptions pour la recherche
      const decryptedProducts = products.map(product => ({
        ...product,
        description: EncryptionService.decrypt(product.description),
        purchasePrice: EncryptionService.decrypt(product.purchasePrice),
        quantity: EncryptionService.decrypt(product.quantity)
      }));
      
      const results = decryptedProducts.filter(product => 
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log(`🔍 Search query "${query}" returned ${results.length} results`);
      return results;
    } catch (error) {
      console.error("❌ Error searching products:", error);
      return [];
    }
  },

  // Create new product
  create: (productData) => {
    try {
      console.log('📝 Creating new product:', productData);
      
      const data = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(data);
      
      // Create new product object with encrypted sensitive data
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        description: EncryptionService.encrypt(productData.description),
        purchasePrice: EncryptionService.encrypt(productData.purchasePrice.toString()),
        quantity: EncryptionService.encrypt(productData.quantity.toString())
      };
      
      // Add to products array
      products.push(newProduct);
      
      // Write back to file with proper formatting
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      
      console.log('✅ Product created successfully:', newProduct);
      console.log(`📊 Total products in database: ${products.length}`);
      
      return newProduct;
    } catch (error) {
      console.error("❌ Error creating product:", error);
      return null;
    }
  },

  // Update product
  update: (id, productData) => {
    try {
      console.log(`📝 Updating product ${id}:`, productData);
      
      const data = fs.readFileSync(productsPath, 'utf8');
      let products = JSON.parse(data);
      
      // Find product index
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        console.log(`❌ Product not found for update: ${id}`);
        return null;
      }
      
      // Update product data
      products[productIndex] = { ...products[productIndex], ...productData };
      
      // Write back to file with proper formatting
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      
      console.log('✅ Product updated successfully:', products[productIndex]);
      return products[productIndex];
    } catch (error) {
      console.error("❌ Error updating product:", error);
      return null;
    }
  },

  // Delete product
  delete: (id) => {
    try {
      console.log(`🗑️ Deleting product ${id}`);
      
      const data = fs.readFileSync(productsPath, 'utf8');
      let products = JSON.parse(data);
      
      // Find product index
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        console.log(`❌ Product not found for deletion: ${id}`);
        return false;
      }
      
      // Store product info for logging
      const deletedProduct = products[productIndex];
      
      // Remove product from array
      products.splice(productIndex, 1);
      
      // Write back to file with proper formatting
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      
      console.log('✅ Product deleted successfully:', deletedProduct.description);
      console.log(`📊 Remaining products in database: ${products.length}`);
      
      return true;
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      return false;
    }
  },

  // Update product quantity
  updateQuantity: (id, quantityChange) => {
    try {
      console.log(`📦 Updating quantity for product ${id} by ${quantityChange}`);
      
      const data = fs.readFileSync(productsPath, 'utf8');
      let products = JSON.parse(data);
      
      // Find product index
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        console.log(`❌ Product not found for quantity update: ${id}`);
        return null;
      }
      
      // Check if enough quantity is available
      if (products[productIndex].quantity + quantityChange < 0) {
        console.log(`❌ Not enough quantity available for product ${id}`);
        return { error: "Not enough quantity available" };
      }
      
      // Update quantity
      products[productIndex].quantity += quantityChange;
      
      // Write back to file with proper formatting
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      
      console.log('✅ Product quantity updated successfully:', products[productIndex]);
      return products[productIndex];
    } catch (error) {
      console.error("❌ Error updating product quantity:", error);
      return null;
    }
  }
};

module.exports = Product;
