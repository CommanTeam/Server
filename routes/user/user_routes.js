/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
router.use('/signin', require('./signin'));

// Signup
router.use('/signup', require('./signup'));

// Return Token
router.use('/return_token', require('./return_token'));

module.exports = router;
