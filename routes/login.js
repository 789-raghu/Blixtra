const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const usermodel = require('../Model/usersmodel');

router.get('/', function (req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { title: 'Login', message: '' });
});


// POST login
router.post('/', async function (req, res, next) {
    const { email, password } = req.body;

    try {
        // Find user by emailId
        const user = await usermodel.findOne({ emailId: email });

        if (!user) {
            return res.render('login', { message: "Invalid email or password" });
        }

        // Compare provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', { message: "Invalid email or password" });
        }

        // Store user info in session
        req.session.user = {
            id: user._id,
            email: user.emailId,
        };

        // After successful login, render the dashboard
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Error during login:', error);
        return res.render('login', { message: "Something went wrong, please try again" });
    }
});


// GET logout
router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/'); // Redirect to login or landing page
    });
});

module.exports = router;
