const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    const newUser = await User.create({ name, email, password, phone, age, profileImage });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (profileImage && user.profileImage) {
      // Delete old profile image
      fs.unlinkSync(path.join(__dirname, '../../', user.profileImage));
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profileImage) {
      // Delete profile image
      fs.unlinkSync(path.join(__dirname, '../../', user.profileImage));
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
