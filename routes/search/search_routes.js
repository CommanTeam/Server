/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Signin
// router.use('/signin', require('./signin'));

router.use('/courses', require('./course'));
router.use('/searchresult', require('./search_result'));


module.exports = router;
