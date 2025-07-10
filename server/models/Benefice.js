
const fs = require('fs');
const path = require('path');

const beneficePath = path.join(__dirname, '../db/benefice.json');

const Benefice = {
  // Get all benefit calculations
  getAll: () => {
    try {
      const data = fs.readFileSync(beneficePath, 'utf8');
      const benefices = JSON.parse(data);
      console.log(`📊 Retrieved ${benefices.length} benefit calculations from database`);
      return benefices;
    } catch (error) {
      console.error("❌ Error reading benefit calculations:", error);
      return [];
    }
  },

  // Get benefit calculation by product ID
  getByProductId: (productId) => {
    try {
      const data = fs.readFileSync(beneficePath, 'utf8');
      const benefices = JSON.parse(data);
      const benefice = benefices.find(b => b.productId === productId) || null;
      console.log(`🔍 Retrieved benefit calculation for product ${productId}:`, benefice ? 'Found' : 'Not found');
      return benefice;
    } catch (error) {
      console.error("❌ Error finding benefit calculation by product id:", error);
      return null;
    }
  },

  // Create new benefit calculation
  create: (beneficeData) => {
    try {
      console.log('📝 Creating new benefit calculation:', beneficeData);
      
      const data = fs.readFileSync(beneficePath, 'utf8');
      const benefices = JSON.parse(data);
      
      // Create new benefit calculation object
      const newBenefice = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...beneficeData
      };
      
      // Check if calculation for this product already exists
      const existingIndex = benefices.findIndex(b => b.productId === beneficeData.productId);
      if (existingIndex !== -1) {
        // Update existing calculation
        benefices[existingIndex] = { ...benefices[existingIndex], ...newBenefice, id: benefices[existingIndex].id };
        console.log('✅ Benefit calculation updated successfully:', benefices[existingIndex]);
      } else {
        // Add new calculation
        benefices.push(newBenefice);
        console.log('✅ Benefit calculation created successfully:', newBenefice);
      }
      
      // Write back to file with proper formatting
      fs.writeFileSync(beneficePath, JSON.stringify(benefices, null, 2));
      
      console.log(`📊 Total benefit calculations in database: ${benefices.length}`);
      
      return existingIndex !== -1 ? benefices[existingIndex] : newBenefice;
    } catch (error) {
      console.error("❌ Error creating/updating benefit calculation:", error);
      return null;
    }
  },

  // Update benefit calculation
  update: (id, beneficeData) => {
    try {
      console.log(`📝 Updating benefit calculation ${id}:`, beneficeData);
      
      const data = fs.readFileSync(beneficePath, 'utf8');
      let benefices = JSON.parse(data);
      
      // Find calculation index
      const beneficeIndex = benefices.findIndex(b => b.id === id);
      if (beneficeIndex === -1) {
        console.log(`❌ Benefit calculation not found for update: ${id}`);
        return null;
      }
      
      // Update calculation data
      benefices[beneficeIndex] = { 
        ...benefices[beneficeIndex], 
        ...beneficeData,
        updatedAt: new Date().toISOString()
      };
      
      // Write back to file with proper formatting
      fs.writeFileSync(beneficePath, JSON.stringify(benefices, null, 2));
      
      console.log('✅ Benefit calculation updated successfully:', benefices[beneficeIndex]);
      return benefices[beneficeIndex];
    } catch (error) {
      console.error("❌ Error updating benefit calculation:", error);
      return null;
    }
  },

  // Delete benefit calculation
  delete: (id) => {
    try {
      console.log(`🗑️ Deleting benefit calculation ${id}`);
      
      const data = fs.readFileSync(beneficePath, 'utf8');
      let benefices = JSON.parse(data);
      
      // Find calculation index
      const beneficeIndex = benefices.findIndex(b => b.id === id);
      if (beneficeIndex === -1) {
        console.log(`❌ Benefit calculation not found for deletion: ${id}`);
        return false;
      }
      
      // Store calculation info for logging
      const deletedBenefice = benefices[beneficeIndex];
      
      // Remove calculation from array
      benefices.splice(beneficeIndex, 1);
      
      // Write back to file with proper formatting
      fs.writeFileSync(beneficePath, JSON.stringify(benefices, null, 2));
      
      console.log('✅ Benefit calculation deleted successfully:', deletedBenefice.productDescription);
      console.log(`📊 Remaining benefit calculations in database: ${benefices.length}`);
      
      return true;
    } catch (error) {
      console.error("❌ Error deleting benefit calculation:", error);
      return false;
    }
  }
};

module.exports = Benefice;
