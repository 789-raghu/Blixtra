const express = require('express');
const usermodel = require("../Model/usersmodel");
const router = express.Router();

router.get('/', async function (req, res) {
    if (req.session && req.session.user) {
        try {
            const email = req.session.user.email;
            console.log("email", email);
            const user = await usermodel.findOne({ name: email });
            if (user) {
                res.render('dashboard', { title: 'Dashboard', user: user });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error('Error fetching user for dashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
