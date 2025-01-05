const express = require('express');
const usermodel = require("../Model/usersmodel");
const router = express.Router();

router.get('/', async function (req, res) {
    if (req.session && req.session.user) {
        try {
            // Retrieve email from the session object
            const email = req.session.user.email;
            console.log("email", email);
            // Find the user in the database using the email
            const user = await usermodel.findOne({ emailId: email });
            if (user) {
                // Render the dashboard with user information
                res.render('dashboard', { title: 'Dashboard', user: email });
            } else {
                // If the user is not found in the database, handle appropriately
                res.redirect('/login');
            }
        } catch (error) {
            console.error('Error fetching user for dashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        // Redirect to login if the session is not available
        res.redirect('/login');
    }
});

module.exports = router;
