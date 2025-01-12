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
            name,
            password,
            aadhar,
            pan,
            ration,
            state,
            gender,
            age,
            caste,
            minority,
            differentlyAbled,
            maritalStatus,
            disabilityPercentage,
            bpl,
            student,
            occupation
        } = req.body;
        console.log(req.body);
        // Check if the email already exists
        const existingUser = await userModel.findOne({name: name});
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new userModel({
            name,
            password: hashedPassword, // Store the hashed password
            aadhar,
            pan,
            ration,
            state,
            gender,
            age,
            caste,
            minority,
            differentlyAbled,
            maritalStatus,
            disabilityPercentage,
            bpl,
            student,
            occupation
        });

        await newUser.save();
        const user = await userModel.findOne({name:name});
        req.session.user = {
            id: user._id,
            email: user.name,
        };
        res.redirect('/filters');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
});

module.exports = router;