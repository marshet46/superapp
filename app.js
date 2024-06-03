const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const multer = require('multer');
const path = require('path');

require('dotenv').config();
const verifyToken = require('./middleware/verifiyToken'); // Import the middleware

// Initialize Express app
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.use(bodyParser.json());

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security features middleware
app.use(helmet());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

// Routes import
const userRoutes = require('./routes/userRoute');
const stockRoutes = require('./routes/stockRoute');
const companyRoutes = require('./routes/companyRoute');
const orderRoutes = require('./routes/stockOrderRoute');
const sellRoutes = require('./routes/sellStockRoute');
const newsRoutes = require('./routes/newsRoute');
const depositRoutes = require('./routes/depositRoute');
const withdrawRoutes = require('./routes/withdrawRoute');
const dashboardRoutes = require('./routes/dashboradroute');
const salesRoutes = require('./routes/stockSaleRoute');
// Route definition
app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', userRoutes); // Include the routes
app.use('/api', stockRoutes);
app.use('/api', companyRoutes);
app.use('/api', orderRoutes);
app.use('/api', sellRoutes);
app.use('/api', newsRoutes);
app.use('/api', depositRoutes);
app.use('/api', withdrawRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', salesRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: `Internal Server Error : the Error is -> ${err}` });
});

// Start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('Closing server...');
    // Handle closing server gracefully here (add proper shutdown logic)
    process.exit(0);
});
