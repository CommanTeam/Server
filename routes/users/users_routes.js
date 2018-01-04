/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
router.use('/main', require('./main'));

router.use('/insert_usr_info', require('./insert_usrinfo'));

router.use('/register', require('./register_check'));

module.exports = router;
