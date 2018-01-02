/*
 Default module
 */
const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');
const async = require('async');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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

/*
 Variable declaration 
 */

/*
 Function Sector
 */

/*
 Method : Get
 */

/*
 Method : Post
 */

 
router.post('/', async(req, res, next) => {

    let user_id = 1;
    let lecture_id = 1;


    let result1 = await sql.getCourseByUserID(user_id);
    console.log('result 1 ' + result1[0]);

    let result2 = await sql.getCourseByLectureID(lecture_id);
    console.log('result 2 ' + result2);

    
    let result3 = await sql.getChapterByLectureID(lecture_id);
    console.log('result 3 ' + result3);

    
    let result4 = await sql.getLectureCntOfUserInCourse(user_id);
    console.log('result 4 ' + result4);


    let result5 = await sql.getCourseInProgressByUserID(user_id);
    console.log('result 5 ' + result5);




    res.status(200).send({
        msg : " Login Success",
        result1,
        result2,
        result3,
        result4,
        result5
    });
});

module.exports = router;
