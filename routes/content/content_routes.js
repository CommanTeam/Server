/*
 Default module
*/
const express = require('express');
const router = express.Router();


router.use('/coursepage', require('./course_page'));
router.use('/courses', require('./courses'));
router.use('/chapters', require('./chapters'));
router.use('/lectures', require('./lectures'));

router.use('/lecturepicture', require('./lecture_picture'));
router.use('/categories', require('./course_category'));
router.use('/lecturepage', require('./lecture_page'));
router.use('/lecturequiz', require('./lecture_quiz'));
router.use('/lecturevideo', require('./lecture_video'));
router.use('/lecturequestion', require('./lecture_question'));


module.exports = router;
