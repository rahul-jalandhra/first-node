const express = require('express');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
