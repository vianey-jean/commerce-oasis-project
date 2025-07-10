const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/pretfamilles', require('./routes/pretfamilles'));
app.use('/api/pretproduits', require('./routes/pretproduits'));
app.use('/api/depenses', require('./routes/depenses'));
app.use('/api/benefices', require('./routes/benefices'));
app.use('/api/sync', require('./routes/sync'));

// Static files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
