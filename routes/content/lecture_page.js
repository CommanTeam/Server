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
router.get('/nextLecture', async(req, res, next) => {
    console.log("===lecture_page.js ::: router('/nextLecture')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    var dataOfCourse = {};
    dataOfCourse.lectureType=[];
    dataOfCourse.lectureID=[];
    var dataOfChapter = [];
    var resultOfCourse = -1;
    var resultOfChapter = -1;
    let lectureID = req.query.lectureID;
    // let lectureID = req.query.lectureID;
    let userID = chkToken.email;
    let purchaseFlag;
    let openedChapter;
    let chapterID;
    let courseID;

    var selectChapterID = 
    `
    SELECT chapter_id FROM comman.all_course_info WHERE lecture_id = ?;
    `

    var selectCourseID = 
    `
    SELECT course_id FROM comman.all_course_info WHERE lecture_id = ?;
    `

    let dataOfChapterID = await db.queryParamCnt_Arr(selectChapterID, lectureID);
    let dataOfCourseID = await db.queryParamCnt_Arr(selectCourseID, lectureID);

    if(dataOfChapterID.length != 0){
        chapterID = dataOfChapterID[0].chapter_id;
    }

    if(dataOfCourseID.length != 0){
        courseID = dataOfCourseID[0].course_id;
    }

    console.log("chapterID : " + chapterID);
    console.log("courseID : " + courseID);

    // console.log("chapterID here " + chapterID[0].chapter_id);
    // console.log(courseID[0].course_id);


    var selectCourseInfoByUserID=
    `SELECT ur.user_id, ur.purchase_flag, A.chapter_id, A.chapter_priority, A.lecture_id, A.lecture_type, A.opened_chapter 
    FROM user_register ur 
    LEFT JOIN all_course A
    ON ur.course_id = A.course_id 
    WHERE ur.user_id = ?
    AND A.course_id = ?
    ORDER BY chapter_priority, lecture_priority`;
    
    let data = await db.queryParamCnt_Arr(selectCourseInfoByUserID, [userID, courseID]);

    if(data != undefined && data.length != 0){
        purchaseFlag = data[0].purchase_flag;
        openedChapter = data[0].opened_chapter;

        if(purchaseFlag == 1){
            for(var i=0; i<data.length; i++){
                // dataOfCourse.push({lectureType : data[i].lecture_type, lectureID : data[i].lecture_id});
                dataOfCourse.lectureType.push(data[i].lecture_type);
                dataOfCourse.lectureID.push(data[i].lecture_id);

                if(chapterID == data[i].chapter_id){
                    // console.log("here!");
                    dataOfChapter.push(data[i].lecture_id);
                }


            }
        } else{
            for(var i=0; data[i].chapter_priority <= openedChapter; i++){
                // console.log("here");
                // dataOfCourse.push({lectureType : data[i].lecture_type, lectureID : data[i].lecture_id});
                dataOfCourse.lectureType.push(data[i].lecture_type);
                dataOfCourse.lectureID.push(data[i].lecture_id);

                if(chapterID == data[i].chapter_id){
                    // console.log("here!");
                    dataOfChapter.push(data[i].lecture_id);
                }
            }
            
        }

        console.log(dataOfCourse);
        console.log(dataOfChapter);
    }

    //현재 lecture의 index값 구하기 

    if(dataOfCourse.length != 0){

        var dataOfCourseLectureIDArray = dataOfCourse.lectureID;

        var currentIndexByCourse = dataOfCourseLectureIDArray.indexOf(parseInt(lectureID));

        var nextLectureIDByCourse = dataOfCourse.lectureID[currentIndexByCourse+1];
        if(nextLectureIDByCourse != undefined){
            resultOfCourse = {lectureID : dataOfCourse.lectureID[currentIndexByCourse+1], lectureType: dataOfCourse.lectureType[currentIndexByCourse+1]};
        } else{
            resultOfCourse = {lectureID : -1, lectureType: -1};
        }
    }

    if(dataOfChapter.length != 0){
        var currentIndexByChapter = dataOfChapter.indexOf(parseInt(lectureID));
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
