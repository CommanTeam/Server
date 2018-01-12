/*
 Default module
*/
const express = require('express');
const router = express.Router();

// Default
router.use('/', require('./default/comman'));

// Users
router.use('/users', require('./users/users_routes'));

// Content
router.use('/content', require('./content/content_routes'));

// Search
router.use('/search', require('./search/search_routes'));


module.exports = router;
