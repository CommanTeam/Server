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
        and (uh.watched_flag = 1 or uh.watched_flag = 2)
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




/*
 Method : Post
*/

module.exports = router;