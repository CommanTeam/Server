/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Lecture Page
router.use('/coursepage', require('./course_page'));
router.use('/registers', require('./course_register'));
router.use('/courses', require('./courses'));

module.exports = router;
