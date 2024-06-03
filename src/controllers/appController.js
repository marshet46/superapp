const App  = require('../models/appModel');
const path = require('path');
const fs = require('fs');

// Create a new app
const createApp = async (req, res) => {
  try {
    const { name, url, description, category } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    const app = await App.create({ name, logo, url, description, category });
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all apps
const getAllApps = async (req, res) => {
  try {
    const apps = await App.findAll();
    res.status(200).json(apps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get an app by ID
const getAppById = async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (app) {
      res.status(200).json(app);
    } else {
      res.status(404).json({ error: 'App not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an app
const updateApp = async (req, res) => {
  try {
    const { name, url, description, category } = req.body;
    const app = await App.findByPk(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    if (req.file) {
      if (app.logo) {
        fs.unlinkSync(path.join(__dirname, '../../', app.logo));
      }
      app.logo = `/uploads/${req.file.filename}`;
    }

    app.name = name || app.name;
    app.url = url || app.url;
    app.description = description || app.description;
    app.category = category || app.category;

    await app.save();
    res.status(200).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an app
const deleteApp = async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    if (app.logo) {
      fs.unlinkSync(path.join(__dirname, '../../', app.logo));
    }

    await app.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createApp,
  getAllApps,
  getAppById,
  updateApp,
  deleteApp
};
