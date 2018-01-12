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
router.get('/:courseID', async(req, res, next) => {
    console.log("===course_page.js ::: router('/{courseID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    let courseID = req.params.courseID;
    let result = [];
    result = await sql.getCourseInfoByCourseID(courseID);

    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/coursepage/:courseID "
        });
    }    
});


router.get('/popup/:courseID', async(req, res, next) => {
    console.log("===course_page.js ::: router('/popup/{courseID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    let courseID = req.params.courseID;
    let result = [];
    result = await sql.getExplainPopUpByCourseID(courseID);


    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/coursepage/popup/:courseID "
        });
    }    
});


// 미리보기 강의
/*
 Method : Get
*/
//Written by 형민
//couseID로 강좌에 해당된 첫번째 강의의 첫번째 동영상강의ID를 리턴
//http://ip/content/coursepage/previewvideo/{courseID}
router.get('/previewvideo/:courseID', async(req, res, next) => {
    console.log("===course_page.js ::: router('/previewvideo/:courseID')===");

    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    let courseID = req.params.courseID;
    let result = [];
    let getVideoLecture =

    `
    SELECT  lecture_id 
    FROM all_course 
    WHERE course_id = ?
    AND lecture_type = 2 order by chapter_priority, lecture_priority;
    `

    var lectureIdData = await db.queryParamCnt_Arr(getVideoLecture, courseID);


if( lectureIdData.length > 0){
    let lectureID = lectureIdData[0].lecture_id;


    let getVideoID = 
    `
    SELECT video_id FROM comman.lecture as l, lecture_video lv WHERE l.id = lv.lecture_id AND lecture_id = ?
    `

    videoIDdata = await db.queryParamCnt_Arr(getVideoID, lectureID);

    result = videoIDdata[0].video_id;

}

    if(result != undefined) {
        res.status(200).send({
            "result" : result
        });
    }else{
        res.status(500).send({
            "msg" : "Error /content/coursepage/previewvideo/{courseID} "
        });
    }    
});


module.exports = router;