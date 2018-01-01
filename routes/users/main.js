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

    let listOfCourse = [];
    let result = [];

    // User가 듣고 있는 모든 강좌 출력
    let allCourseList = await sql.getCourseByUserID(userID);
    for(var i; i < allCourseList.length; i++){
        listOfCourse.push(allCourseList[i].course_id);
    }

    // Course에서 User가 수강했거나, 수강 중인 Lecture Count
    for(var i; i < listOfCourse.length; i++){
    var params = [userID, allCourseList[i].course_id];    

    // User가 Course에서 몇개의 Lecutre를 들었는지 Count
    let molecule = await sql.getCourseInProgressByUserIDandCourseID(params); 
    let denominator = await sql.getTotalLectureCntInCourse(allCourseList[i]);
        result.push(molecule[i].cnt / denominator[i].cnt);
    }

    res.status(200).send(
        result 
    );

});




module.exports = router;