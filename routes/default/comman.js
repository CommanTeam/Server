/*
 Default module
 */
const express = require('express');
const router = express.Router();
const async = require('async');
const bodyParser = require('body-parser');
const hangul = require('hangul-js');

/*
Router.use
*/
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*
Custom module
*/
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');
const sql = require('../../module/sql.js');


// API for https Test
router.get('/', async(req, res, next) => {

   res.status(200).send({
       "msg" : "Welcome to Comman World"
   }
   );
});


module.exports = router;