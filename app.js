const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', userRoutes);
app.use('/api/expenses',expenseRoutes);
// test route
app.get('/', (req, res) => {
  res.send('API running');
});

module.exports = app;
