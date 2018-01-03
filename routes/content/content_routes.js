/*
 Default module
*/
const express = require('express');
const router = express.Router();


router.use('/coursepage', require('./course_page'));
router.use('/registers', require('./course_register'));
router.use('/courses', require('./courses'));

router.use('/lecturepage', require('./lecture_page'));


module.exports = router;
