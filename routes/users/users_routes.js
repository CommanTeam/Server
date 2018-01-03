/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
router.use('/main', require('./main'));

router.use('/register', require('./register_check'));

router.use('/purchase', require('./purchase_check'));

router.use('/lectureHistory', require('./history_check'));

module.exports = router;
