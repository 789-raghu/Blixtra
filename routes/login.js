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

router.post('/', async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await usermodel.findOne({ name: email });

        if (!user) {
            return res.render('login', { message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', { message: "Invalid email or password" });
        }
        req.session.user = {
            id: user._id,
            email: user.name,
        };
        return res.redirect('/filters');

    } catch (error) {
        console.error('Error during login:', error);
        return res.render('login', { message: "Something went wrong, please try again" });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});

module.exports = router;
