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



/*
 Method : Get
 */





//written By 형민
//강의 id, user email로 마지막으로 들은 강의 이름, 강의 priority, 단원 이름, 단원 priority, 진도  가져오기  
//http://ip/users/lectureRecentWatch/{lecutreID}
router.get('/:lectureID', async(req, res, next) => {

    console.log("===lecture_recent_watch.js ::: router('/{lectureID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    let lectureID = req.params.lectureID


    //let user_email =  chkToken.email;

    // //이메일로 찾기
    // let getUserIDbyEmail = 
    // `
    // SELECT * 
    // FROM comman_db.user as u,             user_history as uh,             lecture as l
    // where u.id = uh.user_id
    // and uh.lectureID = l.id
    // and u.email = 'user@user'

    let lectureInfo = [];
    let _lectureInfo = {};
    // `
    //lectureID로 chapter_title, chapter_priority, lecture_title, leacture_priority, l.video가져오기
    let selectQuery =
    `
    SELECT c.id as course_ID,c.title as course_title, ch.priority as chapter_priority, l.title as lecture_title, l.priority as lecture_priority, l.type as lecture_type
    FROM course c, chapter ch, lecture l 
    WHERE c.id = ch.course_id
    AND ch.id = l.chapter_id
    AND l.id = ?
    `;
    
    let getCountQuizbyLectureID = 
    `
    SELECT count(*) as quizCount
    FROM lecture_quiz 
    WHERE lecture_id = ?
    `;

    let getCountPicturebyLectureID =
    `   
    SELECT count(*) as pictureCount
    FROM lecture_picture 
    WHERE lecture_id = ?;

    `
    let getVideoIDByLectureID = 
    `SELECT video_id FROM 
    lecture_video 
    WHERE lecture_id = ?`
    

    let data = await db.queryParamCnt_Arr(selectQuery,lectureID);
    
    // lecture_type = 0 ==> 퀴즈
    let cntQuiz = await db.queryParamCnt_Arr(getCountQuizbyLectureID,lectureID);

    // lecture_type = 1 ==> 글,그림
    let cntPicture = await db.queryParamCnt_Arr(getCountPicturebyLectureID,lectureID);

    // lecture_type = 2 ==> 비디오 
    let videoID = await db.queryParamCnt_Arr(getVideoIDByLectureID,lectureID);



    _lectureInfo.course_ID = data[0].course_ID;
    _lectureInfo.course_title = data[0].course_title;
    _lectureInfo.chapter_priority = data[0].chapter_priority;
    _lectureInfo.lecture_title = data[0].lecture_title;
    _lectureInfo.lecture_priority = data[0].lecture_priority;
    _lectureInfo.lecture_type = data[0].lecture_type;

    
    if(cntQuiz[0].quizCount != 0){
        console.log("here quiz");
        // _lectureInfo.lecture_type = 0;
        lectureInfo.cnt_lecture_picture = cntPicture[0].pictureCount;
    }
    if(cntPicture[0].pictureCount != 0){
        console.log("here picture");
        // _lectureInfo.lecture_type = 1;
        _lectureInfo.cnt_lecture_picture = cntPicture[0].pictureCount;
    }
    if(videoID[0] != undefined){
        console.log("here video");
        // _lectureInfo.lecture_type = 2;
        _lectureInfo.lecture_video_id = videoID[0].video_id;
        console.log("videoID : " + videoID[0].video_id);
    }





    // _lectureInfo.lecture_type = data[0].lecture_type;
    // _lectureInfo.lecture_video_id = data[0].video_id
    // _lectureInfo.cnt_lecture_quiz = cntQuiz[0].cnt_quiz;
    // _lectureInfo.cnt_lecture_picture = cntPicture[0].cnt_picture;    

    // //이메일로 강좌의 듣거나 듣는 중인 강의 수 구하기
    
    // //강의 아아디로 현재 강좌ID구하기 
    // let selectQuery2 =          
    // ` 
    // SELECT c.id
    // FROM comman_db.course c, comman_db.chapter ch, comman_db.lecture l
    // WHERE c.id = ch.course_id 
    // AND ch.id = l.chapter_id 
    // AND l.id = ?
    // ` 

    // let getCourseIDbyLectureID = await db.queryParamCnt_Arr(selectQuery2,lectureID);


    // //강의 ID로 강좌의 강의 총 수 구하기. //분모
    // let selectQuery3 =
    // `
    // SELECT  COUNT(l.id) as cntLectureIDbyLectureID
    // FROM comman_db.course c, comman_db.chapter ch, comman_db.lecture l
    // WHERE c.id = ch.course_id 
    // AND ch.id = l.chapter_id 
    // AND c.id = ?
    // `;//강좌의 강의 총 수 구하기.

    // let getCntLectureIDbyCourseID = await db.queryParamCnt_Arr(selectQuery3,getCourseIDbyLectureID[0].id);

    // _lectureInfo.lecture_in_progress = getCntLectureIDbyCourseID[0].cntLectureIDbyLectureID;

    var result = _lectureInfo;

    res.status(200).send({
       "result" : result
   });
});


module.exports = router;