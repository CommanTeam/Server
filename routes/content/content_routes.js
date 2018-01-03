/*
 Default module
*/
const express = require('express');
const router = express.Router();


router.use('/coursepage', require('./course_page'));
router.use('/courses', require('./courses'));

router.use('/lecturepicture', require('./lecture_picture'));
router.use('/categories', require('./course_category'));
router.use('/lecturepage', require('./lecture_page'));


module.exports = router;
