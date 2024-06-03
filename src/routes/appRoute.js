const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Create a new app
router.post('/app', upload.single('logo'), appController.createApp);

// Get all apps
router.get('/app', appController.getAllApps);

// Get an app by ID
router.get('/app/:id', appController.getAppById);

// Update an app
router.put('/app/:id', upload.single('logo'), appController.updateApp);

// Delete an app
router.delete('/app/:id', appController.deleteApp);

module.exports = router;
