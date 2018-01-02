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
    let courseID = req.params.courseID;

    
    let selectQuery = `
    select title
    from lecture
    where lecture.id = ?
    `

    let data = {};         
    data.courseTitle = await sql.getCourseTitleByLectureID(lectureID);
    data.chapterTitle = await sql.getChapterTitleByLectureID(lectureID);
    let tmpResult = await db.queryParamCnt_Arr(selectQuery,lectureID);
    data.lectureTitle = tmpResult[0].title;

    if(JSON.stringify(data) != '{}'){
        res.status(200).send({
            "result" : data 
        });
    }else{
        res.status(500).send({
            "msg" : "Error lastWatchedLecture "
        });
    }    
});


router.post('/progressLecture', async(req, res, next) => {
    let userID = req.body.userID;

    let listOfCourse = [];
    let result = [];

    // User가 듣고 있는 모든 강좌 출력
    let allCourseList = await sql.getCourseByUserID(userID);
    
    for(var i=0; i < allCourseList.length; i++){
        listOfCourse.push(allCourseList[i].course_id);
    }
    console.log('listOfCouser.length : ' + listOfCourse.length);

    // Course에서 User가 수강했거나, 수강 중인 Lecture Count
    for(var i=0; i < listOfCourse.length; i++){
        let params = [];
        params.push(userID);
        params.push(listOfCourse[i]);
    console.log('params[0]  : ' + params[0]);
    console.log('params[1]  : ' + params[1]);

    // User가 Course에서 몇개의 Lecutre를 들었는지 Count
    let molecule = await sql.getCourseInProgressByUserIDandCourseID(params); 
    console.log('molecule : ' + molecule[0].cnt);

    let denominator = await sql.getTotalLectureCntInCourse(listOfCourse[i]);
    console.log('denominator : ' + denominator[0].cnt);
    console.log('percentage : ' + molecule[0].cnt / denominator[0].cnt * 100);
    console.log('---------------------');
        result.push(molecule[0].cnt / denominator[0].cnt * 100);
    }

    res.status(200).send({
        "result" : result
    });

});



/*
 Method : Post
*/

module.exports = router;