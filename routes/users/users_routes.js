/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
router.use('/main', require('./main'));

router.use('/insert_user_info', require('./insert_userinfo'));

router.use('/register', require('./register_check'));

router.use('/purchase', require('./purchase_check'));

router.use('/lectureHistory', require('./history_check'));

router.use('/lectureRecentWatch', require('./lecture_recent_watch'));



module.exports = router;
