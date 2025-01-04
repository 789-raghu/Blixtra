const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const userModel = require('../Model/usersmodel'); // Adjust the path accordingly

router.get('/', function (req, res) {
    res.render('signup', { title: 'Sign Up - Blixtra' });
});

router.post('/', async (req, res) => {
    try {
        const {
            emailId,
            password,
            gender,
            caste,
            disability,
            healthConditions,
            economy,
            state,
            city,
            educationLevel,
            isStudent,
            isWidow,
        } = req.body;
        console.log(req.body);
        // Check if the email already exists
        const existingUser = await userModel.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new userModel({
            emailId,
            password: hashedPassword,
            gender,
            caste: caste || null,
            disability: disability || false,
            healthConditions: healthConditions || [],
            economy,
            state,
            city,
            educationLevel,
            isStudent: isStudent || false,
            isWidow: isWidow || false,
        });

        // Save user to database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
});

module.exports = router;