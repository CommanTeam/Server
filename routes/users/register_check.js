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



 function array_diff(a, b) {
  var tmp={}, res=[];
  for(var i=0;i<a.length;i++) tmp[a[i]]=1;
      for(var i=0;i<b.length;i++) { if(tmp[b[i]]) delete tmp[b[i]]; }
          for(var k in tmp) res.push(k);
              return res;
      }
/*
 Method : Get
 */
//written by 성찬
//등록된 강좌인지 체크  return 0: 등록안됨, return 1: 등록됨
//localhost:3000/users/register/{courseID}
router.get('/:courseID', async(req, res, next) => {
    console.log("===register_check.js ::: router('/{courseID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let userID = chkToken.email;
    let courseID = req.params.courseID;
    let result = 0;

    let checkRegisterByUserIDAndCourseID =
    `
    select id from user_register where user_id = ? and course_id = ?
    `;


    var data = await db.queryParamCnt_Arr(checkRegisterByUserIDAndCourseID, [userID, courseID]);
    console.log("register check data ===> " + data[0]);
    // console.log(data.length);

    if(data != undefined && data.length !=0){
        result = 1;
    }


    res.status(200).send({
        result
    });
});





/*
 Method : Post
 */
//written by 성찬
//강좌 등록
//localhost:3000/users/register
router.post('/', async(req, res, next) => {
    console.log("===register_check.js ::: router('/')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let userID = chkToken.email;
    let courseID = req.body.courseID;
    // let userListenCourse = [];
    // let userListenLecture = [];
    // let allLecture = [];
    // let userUnListenedLecture = 
    let lectureHistoryArray = [];

    //insert regist query
    let insertQuery =
    `
    insert into user_register (user_id, course_id, purchase_flag)
    values (?,?, 0)
    `;
    var data = await db.queryParamCnt_Arr(insertQuery, [userID, courseID]);

    console.log("course register do ==>" + data);



    let query = 
    `SELECT ac.course_id, ac.chapter_id, ac.lecture_id, uh.user_id 
    FROM all_course ac LEFT JOIN user_history uh 
    ON ac.lecture_id = uh.lecture_id 
    AND user_id = ? ORDER BY course_id
    `;

    let insertHistoryLectureId =
    `
    INSERT INTO user_history (user_id, lecture_id, watched_flag) VALUES (?, ?, 0);
    `;


    let dataOfRegister = await db.queryParamCnt_Arr(query, userID);


    if(dataOfRegister != undefined && dataOfRegister.length != 0){
        for(var i=0; i<dataOfRegister.length ;i++){
            if(dataOfRegister[i].user_id == undefined){
                lectureHistoryArray.push(dataOfRegister[i].lecture_id)
            }
        }
    }

    for(var i=0; i<lectureHistoryArray.length;i++){
        console.log("do!");
        await db.queryParamCnt_Arr(insertHistoryLectureId, [userID, lectureHistoryArray[i]]);
    }


    // if(dataOfRegister != undefined && dataOfRegister.length != 0){
    //     for(var i = 0; i<dataOfRegister.length; i++){

    //         if(userListenCourse.indexOf(dataOfRegister[i].course_id) == -1){
    //             console.log("등록한 강좌! : " + dataOfRegister[i].course_id);
    //             userListenCourse.push(dataOfRegister[i].course_id); // 듣고있는 강좌목록 리스트
    //         }

    //         if(userListenLecture.indexOf(dataOfRegister[i].lecture_id) == -1){
    //             userListenLecture.push(dataOfRegister[i].lecture_id); // 듣고있는 강의 리스트
    //         }
    //     }
    //     console.log("userListene!!!!" + userListenCourse);
    //     console.log("userLecture!!!!" + userListenLecture);
    // }

    // let selectLectureByCourseID =
    // `
    // SELECT lecture_id FROM all_course_info WHERE course_id = ?
    // `  
    // for(var i=0;i<userListenCourse.length;i++){
    //     let allLectureDataByCourseID = await db.queryParamCnt_Arr(selectLectureByCourseID, userListenCourse[i]);

    //     for(var j=0;j<allLectureDataByCourseID.length;j++){
    //         allLecture.push(allLectureDataByCourseID[j].lecture_id);
    //     }
    // }

    // for(var i=0;i<userListenLecture.length;i++){


    //     userUnListenedLecture = array_diff(allLecture, userListenLecture);


    //     // userUnListenedLecture.splice(userListenLecture.indexOf(userListenLecture[i]), 1);
    // }
    // console.log(userUnListenedLecture);


    // let insertHistoryLectureId =
    // `
    // INSERT INTO user_history (user_id, lecture_id, watched_flag) VALUES (?, ?, 0);
    // `;



    // let selectUserHistoryByLectureId = 
    // `
    // SELECT lecture_id FROM user_history WHERE lecture_id = ?
    // `
    
    // console.log(userUnListenedLecture);
    // console.log(userUnListenedLecture[i]);
    // for(var i=0;i<userUnListenedLecture.length;i++){
    //     let checkDuplicate = await db.queryParamCnt_Arr(selectUserHistoryByLectureId, userUnListenedLecture[i]);
    //     // if(checkDuplicate[i].lecture_id == 0){
    //     //     await db.queryParamCnt_Arr(insertHistoryLectureId, userUnListenedLecture[i].lecture_id)
    //     // }
    // }
    // // let confirm = await db.queryParamCnt_Arr(selectUserHistoryByLectureId, userListenCourse[i]);

    // // console.log("confirm value ==>  " + confirm[0].lecture_id);



    // // if(confirm[])

    // // console.log(userUnListenedLecture);
    // if(userUnListenedLecture.length != 0)
    //     for(var i=0;i<userUnListenedLecture.length;i++){
    //         await db.queryParamCnt_Arr(insertHistoryLectureId, [userID, userUnListenedLecture[i]]);
    //     }








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