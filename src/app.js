const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./apidocs/app.json'); // Import your Swagger JSON
const swaggerUser = require('./apidocs/user.json'); // Import your Swagger JSON
const swaggerPost = require('./apidocs/post.json'); // Import your Swagger JSON

require('dotenv').config();

// Initialize Express app
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
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
const appRoutes = require('./routes/appRoute');
const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');
// Route definition
app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', appRoutes); // Include the routes
app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/user-docs', swaggerUi.serve, swaggerUi.setup(swaggerUser));
app.use('/post-docs', swaggerUi.serve, swaggerUi.setup(swaggerPost));

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
