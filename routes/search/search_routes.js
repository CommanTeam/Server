/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
// router.use('/signin', require('./signin'));
router.use('/course', require('./course'));


module.exports = router;
