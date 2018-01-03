/*
 Declare module
 */
 const express = require('express');
 const router = express.Router();
 const async = require('async');
 const bodyParser = require('body-parser');

 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');


/*
 Method : Get
 */
//written by 형민
//등록된 강좌인지 체크  return 0: 등록안됨, return 1: 등록됨
//http://ip/content/registers/{lectureID}?userID=###
// router.get('/:lectureID', async(req, res, next) => {

//     let lectureID = req.query.lectureID;
//     let result = [];

//     let checkRegisterByUserIDAndCourseID =
//     `
//         select id from user_register where user_id = ? and course_id=?
//     `;


//     var data = await db.queryParamCnt_Arr(checkRegisterByUserIDAndCourseID, [userID, courseID]);

//     console.log(data.length);

//     if(!data.length==0){
//         result = 1;
//     }


//     res.status(200).send({
//         result
//     });
// });






/*
 Method : Post
 */

 module.exports = router;