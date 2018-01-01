/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
router.use('/main', require('./main'));


module.exports = router;
