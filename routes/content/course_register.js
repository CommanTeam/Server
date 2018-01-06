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
//written by 성찬
//등록된 강좌인지 체크  return 0: 등록안됨, return 1: 등록됨
//http://ip/content/registers/{courseID}?userID=###
router.get('/:courseID', async(req, res, next) => {

    let userID = req.query.userID;
    let courseID = req.params.courseID;
    let result = 0;

    let checkRegisterByUserIDAndCourseID =
    `
        select id from user_register where user_id = ? and course_id=?
    `;


    var data = await db.queryParamCnt_Arr(checkRegisterByUserIDAndCourseID, [userID, courseID]);

    // console.log(data.length);

    if(!data.length==0){
        result = 1;
    }


    res.status(200).send({
        result
    });
});





/*
 Method : Post
 */
 router.post('/', async(req, res, next) => {
    let courseID = req.body.courseID;
    let userID = req.body.userID;

    console.log(courseID, userID);
    //insert regist query
    let insertQuery =
    `
    insert into user_register (user_id, course_id)
    values (?,?)
    `;
    await db.queryParamCnt_Arr(insertQuery, [userID, courseID]);


    res.status(200).send({
        message : "강좌 등록 성공"
    });


    // if(courseID != undefined && UserID != undefined){

    // }else {
    //     res.status(400).send({
    //         message : "잘못된 접근 입니다"
    //     });
    // }
});




/*
 Method : Post
 */

 module.exports = router;