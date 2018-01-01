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

// SQL Test
router.use('/sql_test', require('./sql_test'));

module.exports = router;
