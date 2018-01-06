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
router.get('/lastWatchedLecture/:lectureID', async(req, res, next) => {
    /*
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    */
    let lectureID = req.body.lectureID;
    let selectQuery = `
    select title
    from lecture
    where lecture.id = ?
    `

    let result = {};         
    result.courseTitle = await sql.getCourseTitleByLectureID(lectureID);
    result.chapterTitle = await sql.getChapterTitleByLectureID(lectureID);
    let lectureTitle = await db.queryParamCnt_Arr(selectQuery,lectureID);
    result.lectureTitle = lectureTitle[0].title;

    if(result != undefined) {
        res.status(200).send({
            "result" : result 
        });
    }else{
        res.status(500).send({
            "msg" : "Error /users/main/lastWatchedLecture/:lectureID "
        });
    }    
});

/*
  Req : user ID 
  Res : Progress rate for each course
  Dec : Progress rate
  writtend by 신기용
  */
router.get('/progressLecture/:userID', async(req, res, next) => {
    /*
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    */
    let userID = req.params.userID;
    let listOfCourse = [];
    let result = [];

    // Res : Course List
    // User가 듣고 있는 모든 강좌 출력
    let allCourseList = await sql.getCourseByUserID(userID);
    
    for(var i=0; i < allCourseList.length; i++){
        listOfCourse.push(allCourseList[i].course_id);
    }

    // Course에서 User가 수강했거나, 수강 중인 Lecture Count
    for(var i=0; i < listOfCourse.length; i++){
        let params = [];
        params.push(userID);
        params.push(listOfCourse[i]);
    
    // User가 Course에서 몇개의 Lecutre를 들었는지 Count
    let molecule = await sql.getCourseInProgressByUserIDandCourseID(params); 
    let denominator = await sql.getTotalLectureCntInCourse(listOfCourse[i]);
    let progressInCourse = parseInt(molecule / denominator * 100);


    var selectQuery=`
    select c.title as c_title, c.id as course_id, c.image_path as image_path
	from course as c
	where c.id=? ;
    `
    // 강좌 Title
    let courseTitle = await db.queryParamCnt_Arr(selectQuery,listOfCourse[i]);

    // 강좌가 갖고 있는 단원의 수
    let chapterCnt = await sql.getTotalChapterCntInCourse(listOfCourse[i]);

    let progressCourse = {};
    progressCourse.courseID = courseTitle[0].course_id;
    progressCourse.imagePath = courseTitle[0].image_path;
    progressCourse.courseTitle = courseTitle[0].c_title;
    progressCourse.chapterCnt = chapterCnt;
    progressCourse.progressPercentage = progressInCourse;     
    result.push(progressCourse);
    }

    if(result != undefined) {
        res.status(200).send({
            "result" : result 
        });
    }else{
        res.status(500).send({
            "msg" : "Error /users/main/progressLecture/:userID "
        });
    }    
    

});


/*
  Req : None
  Res : Greeting Ment
  Dec : Greeting Ment
  writtend by 신기용
  */

router.get('/greeting', async(req, res, next) => {
    /*
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    */

    let result = {};
    let mentArr = [];
    mentArr.push(" ment 1 ");
    mentArr.push(" ment 2 ");
    mentArr.push(" ment 3 ");
    mentArr.push(" ment 4 ");
    mentArr.push(" ment 5 ");

    // 인사말 Seed 랜덤으로 출력
    var seed = parseInt(Math.random() * 4 + 1);
    result.ment = mentArr[seed];

    if(result != undefined) {
        res.status(200).send({
            "result" : result 
        });
    }else{
        res.status(500).send({
            "msg" : "Error /users/main/greeting "
        });
    }    
    

});





/*
 Method : Post
*/


module.exports = router;