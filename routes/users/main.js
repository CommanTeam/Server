/*
 Default module
*/
const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');
const async = require('async');
const bodyParser = require('body-parser');

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
 Variable declaration
*/

/*
 Function Sector
*/

/*
 Method : Get
*/
router.get('/', async(req, res, next) => {
    let result = await sql.getLectureCntInCourese(1);
    res.status(200).send(
        result
    );
});


/*
 Method : Post
*/
router.post('/lastWatchedLecture', async(req, res, next) => {
    let lectureID = req.body.lectureID;

    let selectQuery = `
    select title
    from lecture
    where lecture.id = ?
    `

    let data = {};         
    data.courseTitle = await sql.getCourseTitleByLectureID(lectureID);
    data.chapterTitle = await sql.getChapterTitleByLectureID(lectureID);
    data.lectureTitle = await db.queryParamCnt_Arr(selectQuery,lectureID);

    if(JSON.stringify(data) == '{}'){
        res.status(200).send(
            data 
        );
    }else{
        res.status(500).send({
            "msg" : "Error lastWatchedLecture "
        });
    }    
});


router.post('/progressLecture', async(req, res, next) => {

    let userID = req.body.userID;
    let lectureID = req.body.lectureID;

    

    // 분모
    getTotalLectureCntInCourse


    // 분자
    getCourseInProgressByUserID


});




module.exports = router;