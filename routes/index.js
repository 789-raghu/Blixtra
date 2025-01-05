const express = require('express');
const router = express.Router();
const usermodel = require('../Model/usersmodel');

router.get('/', async (req, res) => {
  if (req.session.user) {
    const email = req.session.user.email;
    const user = await usermodel.findOne({ emailId: email});
    return res.render('home', { email: req.session.user.email });
  }
  res.render('landingpage', { title: 'Login' });
});

module.exports = router;
