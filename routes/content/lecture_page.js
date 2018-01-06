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
 router.get('/:userID/:chapterID', async(req, res, next) => {
    /* 
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    */
    let userID = req.params.userID;
    let chapterID = req.params.chapterID;

    // 강의페이지에서 개요 부분
    var selectQuery=`
    select ch.id as ch_id, ch.title as ch_title, ch.info as ch_info
    from chapter as ch
    where ch.id = ?;
    `;

    let result = {};

    let FinalChapterSummary =  {};
    let chapterSummary = await db.queryParamCnt_Arr(selectQuery,chapterID);
    FinalChapterSummary.chapterID = chapterSummary[0].ch_id;
    FinalChapterSummary.chapterTitle = chapterSummary[0].ch_title;
    FinalChapterSummary.chapterInfo = chapterSummary[0].ch_info;
    result.summary = FinalChapterSummary;

    let FinalLectureList = [];

    // Res : Lecture [ ID,title ] List
    let eachLectureList = await sql.getLectureListBelong2Chapter(chapterID);
    
    for(var i=0; i<eachLectureList.length; i++){
        let lectureListObj = {};
        /*
        각 강의에 갖고 있는 퀴즈의 수
        */

        
        // Res : Lecutre Count
        let eachQuizCntBelong2Lecture = await sql.getQuizCntBelong2Lecture(eachLectureList[i].lecture_id);
        lectureListObj.lectureID = eachLectureList[i].lecture_id;
        lectureListObj.lectureTitle = eachLectureList[i].lecture_title;
        lectureListObj.lectureType = eachLectureList[i].lecture_type;
        if (eachLectureList[i].lecture_type != 2){
            lectureListObj.quizCnt = eachQuizCntBelong2Lecture;
        }
        

        // 유저가 강의를 들었는지 유무 판단
        selectQuery = `
        select count(*) as cnt
        from user_history as uh
        where uh.user_id = ?
        and uh.lecture_id = ?
        and uh.watched_flag = 2
        ;
        `

        // Req : userID , lectureID
        // Res : True / False
        let JudgeUserListened2Lecture = await db.queryParamCnt_Arr(selectQuery,[ userID, eachLectureList[i].lecture_id] );
        lectureListObj.listendLectureFlag = JudgeUserListened2Lecture[0].cnt ? true : false;
        FinalLectureList.push(lectureListObj);
    }

    result.lectureList = FinalLectureList;

    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/lecturepage/:chapterID "
        });
    }    
});



 router.get('/lectureList', async(req, res, next) => {

    let chapterID = req.query.chapterID;
    let userID = req.query.userID;

    var result = [];
    var lectureList = {};

    var selectLectureListByUserID = `SELECT l.id as lecture_id, l.chapter_id, l.priority, l.title, l.lecture_type, l.video_id, uh.user_id, uh.watched_flag 
    FROM lecture l LEFT JOIN user_history uh 
    ON l.id = uh.lecture_id 
    AND uh.user_id = ?
    ORDER BY priority`;

    var countImageLecture = `SELECT count(*) as count
    FROM comman_db.lecture_image where lecture_id = ?`;

    var countQuizLecture = `SELECT count(*) as count
    FROM comman_db.quiz_title 
    WHERE lecture_id = ?`;



    let lectureQuery = await db.queryParamCnt_Arr(selectLectureListByUserID, userID);


    for(var i=0;i<lectureQuery.length;i++){

        // console.log(lectureQuery[i].chapter_id);

        if(lectureQuery[i].chapter_id == chapterID){

            lectureList = {};
            lectureList.lectureID = lectureQuery[i].lecture_id;
            lectureList.lecturePriority = lectureQuery[i].priority;
            lectureList.chapterID = lectureQuery[i].chapter_id;
            lectureList.lectureTitle = lectureQuery[i].title;
            lectureList.lectureType = lectureQuery[i].lecture_type;
            lectureList.videoID = lectureQuery[i].video_id;
            lectureList.userID = lectureQuery[i].user_id;


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
                var pictureCount = await db.queryParamCnt_Arr(countImageLecture, lectureQuery[i].lecture_id);
                lectureList.size = "youtube lecture";
            }
            result.push(lectureList);

        }
    }


    res.status(200).send({
        result : result
    });

    



});

//written by 성찬
//http://ip/content/lecturepage/nextLecture?courseID={courseID}&chapterID={chapterID}&lectureID={lectureID}
//courseID와 현재 lectureID로 다음 수강할 강의 가져오기(priority column 이용)
router.get('/nextLecture', async(req, res, next) => {
    /*
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    */
    var dataOfCourse = [];
    var dataOfChapter = [];
    var resultOfCourse;
    var resultOfChapter;
    let courseID = req.query.courseID;
    let chapterID = req.query.chapterID;
    let lectureID = req.query.lectureID;

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


    for(var i=0;i<orderedLectureID.length;i++){
        dataOfCourse.push(orderedLectureID[i].lecture_id.toString());
    }


    for(var i=0;i<orderedLectureIDByChapterID.length;i++){
        dataOfChapter.push(orderedLectureIDByChapterID[i].lecture_id.toString());
    }

    // console.log(dataOfCourse);
    // console.log(dataOfChapter);

    //현재 lecture의 index값 구하기 
    var currentIndexByCourse = dataOfCourse.indexOf(lectureID.toString());
    var nextLectureIDByCourse = dataOfCourse[currentIndexByCourse+1];
    if(nextLectureIDByCourse != undefined){
        resultOfCourse = dataOfCourse[currentIndexByCourse+1];
    } else{
        resultOfCourse = -1;
    }

    var currentIndexByChapter = dataOfChapter.indexOf(lectureID.toString());
    var nextLectureIDByChapter = dataOfChapter[currentIndexByChapter+1];
    if(nextLectureIDByChapter != undefined){
        resultOfChapter = dataOfChapter[currentIndexByChapter+1];
    } else{
        resultOfChapter = -1;
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