/*
 Default module
*/
const express = require('express');
const router = express.Router();

// User
router.use('/user', require('./user/user_routes'));

// Users
router.use('/users', require('./users/users_routes'));

// Lecture
router.use('/lecture', require('./lecture/lecture_routes'));

// Search
router.use('/search', require('./search/search_routes'));


module.exports = router;
