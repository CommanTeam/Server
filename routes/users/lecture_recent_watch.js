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
    let lectureInfo = [];
    let _lectureInfo = {};
    // `
    //lectureID로 chapter_title, chapter_priority, lecture_title, leacture_priority, l.video가져오기
    let selectQuery =
    `
    SELECT c.id as course_ID,c.title as course_title, ch.priority as chapter_priority, l.title as lecture_title, l.priority as lecture_priority, l.type as lecture_type, ch.id as chapter_id
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
    `
    SELECT video_id , play_time
    FROM  lecture_video 
    WHERE lecture_id = ?;
    `
    

    let data = await db.queryParamCnt_Arr(selectQuery,lectureID);
    
    // lecture_type = 0 ==> 퀴즈
    let cntQuiz = await db.queryParamCnt_Arr(getCountQuizbyLectureID,lectureID);

    // lecture_type = 1 ==> 글,그림
    let cntPicture = await db.queryParamCnt_Arr(getCountPicturebyLectureID,lectureID);

    // lecture_type = 2 ==> 비디오 
    let videoID = await db.queryParamCnt_Arr(getVideoIDByLectureID,lectureID);
    
    if( data.length > 0){
        _lectureInfo.course_ID = data[0].course_ID;
        _lectureInfo.course_title = data[0].course_title;
        _lectureInfo.chapter_priority = data[0].chapter_priority;
        _lectureInfo.chapter_ID = data[0].chapter_id;

        _lectureInfo.lecture_title = data[0].lecture_title;
        _lectureInfo.lecture_priority = data[0].lecture_priority;
        _lectureInfo.lecture_type = data[0].lecture_type;

        _lectureInfo.lecture_video_id = "";
        _lectureInfo.playTime = -1;

        _lectureInfo.cnt_lecture_quiz = 0;
        _lectureInfo.cnt_lecture_picture = 0;
    }

    
    if(cntQuiz[0].quizCount != 0){
        console.log("here quiz");
        // _lectureInfo.lecture_type = 0;
        _lectureInfo.cnt_lecture_quiz = cntQuiz[0].quizCount;
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
        _lectureInfo.playTime = videoID[0].play_time;
        console.log("videoID : " + videoID[0].video_id);
    }

    var result = _lectureInfo;

    res.status(200).send({
       "result" : result
   });
});


module.exports = router;