/*
 Declare module
 */
 const express = require('express');
 const router = express.Router();
 const crypto = require('crypto-promise');
 const async = require('async');
 const bodyParser = require('body-parser');

 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');


/*
 Method : Get
 */


router.get('/lectureList', async(req, res, next) => {
    console.log("===lecture_page.js ::: router('/lectureList')===");
    const chkToken = jwt.verify(req.headers.authorization);
    // 토큰 검증 실패
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let chapterID = req.query.chapterID;
    let userID = chkToken.email;
    console.log(userID);
    
    var result = [];
    var lectureList = {};

    var selectLectureListByUserID = `SELECT l.id as lecture_id, l.chapter_id, l.priority, l.title, l.type as lecture_type, uh.watched_flag 
    FROM lecture l LEFT JOIN user_history uh 
    ON l.id = uh.lecture_id 
    AND uh.user_id = ?
    ORDER BY priority`;

    var videoLecture = `SELECT video_id FROM comman.lecture_video WHERE lecture_id = ?`; 

    var countImageLecture = `SELECT count(*) as count
    FROM comman.lecture_picture where lecture_id = ?`;

    var countQuizLecture = `SELECT count(*) as count
    FROM comman.lecture_quiz 
    WHERE lecture_id = ?`;


    let lectureQuery = await db.queryParamCnt_Arr(selectLectureListByUserID, userID);
    // console.log(" [in lecture_page ] lectureQuery Cnt : " + lectureQuery.length ) ; 

    if(lectureQuery != undefined && lectureQuery.length != 0){
        // console.log(' if(lectureQuery != undefined){ ');
        for(var i=0;i<lectureQuery.length;i++){
        // console.log(lectureQuery[i].chapter_id);
        if(lectureQuery[i].chapter_id == chapterID){
            lectureList = {};
            lectureList.lectureID = lectureQuery[i].lecture_id;
            lectureList.lecturePriority = lectureQuery[i].priority;
            lectureList.chapterID = lectureQuery[i].chapter_id;
            lectureList.lectureTitle = lectureQuery[i].title;
            lectureList.lectureType = lectureQuery[i].lecture_type;
            // lectureList.videoID = lectureQuery[i].video_id;
            // lectureList.userID = lectureQuery[i].user_id;
            lectureList.watchedFlag = lectureQuery[i].watched_flag;

            if(lectureQuery[i].watched_flag == undefined){
                lectureList.watchedFlag = 0;
            }

            if(lectureQuery[i].lecture_type == 0){
                var quizCount = await db.queryParamCnt_Arr(countQuizLecture, lectureQuery[i].lecture_id);
                lectureList.size = quizCount[0].count;
            } 
            if(lectureQuery[i].lecture_type == 1){
                var pictureCount = await db.queryParamCnt_Arr(countImageLecture, lectureQuery[i].lecture_id);
                lectureList.size = pictureCount[0].count;
            } 
            if(lectureQuery[i].lecture_type == 2){
                var videoID = await db.queryParamCnt_Arr(videoLecture, lectureQuery[i].lecture_id);
                lectureList.videoID = videoID[0].video_id;
                lectureList.size = -1;
            }
            result.push(lectureList);
            // console.log('lectureList ID : ' + lectureList.lectureID);
            // console.log('lectureList lectureTitle : ' + lectureList.lectureTitle);
        }
    }
}

// console.log(" [in lecutre_page] result : " + result[0] );

res.status(200).send({
    result : result
});




});

//written by 성찬
//http://ip/content/lecturepage/nextLecture?lectureID={lectureID}
//현재 lectureID로 다음 수강할 강의 가져오기(priority column 이용)
router.get('/nextLecture/', async(req, res, next) => {
    console.log("===lecture_page.js ::: router('/nextLecture')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    var dataOfCourse = [];
    var dataOfChapter = [];
    var resultOfCourse = -1;
    var resultOfChapter = -1;
    let lectureID = req.query.lectureID;

    var selectChIDCoIDbyLectureID=
    `
    SELECT course_id as course_id, chapter_id as chapter_id, lecture_id as lecture_id
    FROM comman_db.all_course_info
    WHERE lecture_id = ?

    `
    let chapterID = 0;
    let courseID = 0;
    let data = await db.queryParamCnt_Arr(selectChIDCoIDbyLectureID, lectureID);


    if(data.length != 0){
        chapterID = data[0].chapter_id;
        courseID = data[0].course_id;
    }

    var selectAllLectureIDInCourse=`
    SELECT l.id as lecture_id 
    FROM course c, chapter ch, lecture l 
    WHERE c.id=ch.course_id 
    AND ch.id=l.chapter_id 
    AND course_id = ? 
    ORDER BY ch.priority, l.priority;
    `;

    var selectLectureIDInChapter=`
    SELECT l.id as lecture_id 
    FROM course c, chapter ch, lecture l 
    WHERE c.id=ch.course_id 
    AND ch.id=l.chapter_id 
    AND chapter_id = ?
    ORDER BY ch.priority, l.priority;
    `

    let orderedLectureID = await db.queryParamCnt_Arr(selectAllLectureIDInCourse, courseID);
    let orderedLectureIDByChapterID = await db.queryParamCnt_Arr(selectLectureIDInChapter, chapterID);
    
    console.log(orderedLectureID);
    console.log(orderedLectureIDByChapterID);

    if(orderedLectureID.length != 0){
        for(var i=0;i<orderedLectureID.length;i++){
            dataOfCourse.push(orderedLectureID[i].lecture_id.toString());
        }
    }
    if(orderedLectureIDByChapterID.length != 0){
        for(var i=0;i<orderedLectureIDByChapterID.length;i++){
            dataOfChapter.push(orderedLectureIDByChapterID[i].lecture_id.toString());
        }
    }

    // console.log(dataOfCourse);
    // console.log(dataOfChapter);

    //현재 lecture의 index값 구하기 

    if(dataOfCourse.length != 0){
        var currentIndexByCourse = dataOfCourse.indexOf(lectureID.toString());
        var nextLectureIDByCourse = dataOfCourse[currentIndexByCourse+1];
        if(nextLectureIDByCourse != undefined){
            resultOfCourse = dataOfCourse[currentIndexByCourse+1];
        } else{
            resultOfCourse = -1;
        }
    }

    if(dataOfChapter.length != 0){
        var currentIndexByChapter = dataOfChapter.indexOf(lectureID.toString());
        var nextLectureIDByChapter = dataOfChapter[currentIndexByChapter+1];
        if(nextLectureIDByChapter != undefined){
            resultOfChapter = dataOfChapter[currentIndexByChapter+1];
        } else{
            resultOfChapter = -1;
        }
    }

    res.status(200).send({
        "nextLectureOfCourse" : resultOfCourse,
        "nextLectureOfChapter" : resultOfChapter
    });  
});






/*
 Method : Post
 */

 module.exports = router;
