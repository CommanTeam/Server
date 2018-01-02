/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Lecture Page
router.use('/coursepage', require('./course_page'));


module.exports = router;
