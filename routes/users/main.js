/*
 Declare module
 */
 const express = require('express');
 const router = express.Router();
 const crypto = require('crypto-promise');
 const async = require('async');
 const bodyParser = require('body-parser');
 const moment = require('moment');
 const jwt = require('../../module/jwt.js');
 const db = require('../../module/pool.js');
 const sql = require('../../module/sql.js');



function array_diff(a, b) {
  var tmp={}, res=[];
  for(var i=0;i<a.length;i++) tmp[a[i]]=1;
  for(var i=0;i<b.length;i++) { if(tmp[b[i]]) delete tmp[b[i]]; }
  for(var k in tmp) res.push(k);
  return res;
}
/*
 Method : Get
 */
 router.get('/lastWatchedLecture/:lectureID', async(req, res, next) => {
    console.log("===main.js ::: router('/lastWatchedLecture/{lectureID}')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }
    
    let lectureID = req.body.lectureID;
    let selectQuery = `
    select title
    from lecture
    where lecture.id = ?
    `

    let result = {};         
    result.courseTitle = await sql.getCourseTitleByLectureID(lectureID); //탁형민이 추가한 부분
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
  router.get('/progressCourse', async(req, res, next) => {
    console.log("===main.js ::: router('/progressCourse')===");
    const chkToken = jwt.verify(req.headers.authorization);
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let userListenCourse = [];
    let userListenLecture = [];
    let allLecture = [];
    let userUnListenedLecture = [];
    let userID = chkToken.email;
    let listOfCourse = [];
    let result = [];

    let query = 
    `SELECT ac.course_id, ac.chapter_id, ac.lecture_id, uh.user_id 
    FROM all_course ac, user_history uh 
    WHERE ac.lecture_id = uh.lecture_id 
    AND user_id = ? ORDER BY course_id
    `;

    let data = await db.queryParamCnt_Arr(query, userID);



    if(data != undefined && data.length != 0){
        for(var i = 0; i<data.length; i++){

            if(userListenCourse.indexOf(data[i].course_id) == -1){
                console.log("hsakjldfhalskdf");
                userListenCourse.push(data[i].course_id); // 듣고있는 강좌목록 리스트
            }

            if(userListenLecture.indexOf(data[i].lecture_id) == -1){
                userListenLecture.push(data[i].lecture_id); // 듣고있는 강의 리스트
            }
        }
        console.log("userListene!!!!" + userListenCourse);
        console.log("userLecture!!!!" + userListenLecture);
    }

    let selectLectureByCourseID =
    `
        SELECT lecture_id FROM all_course_info WHERE course_id = ?
    `  
    for(var i=0;i<userListenCourse.length;i++){
        let allLectureDataByCourseID = await db.queryParamCnt_Arr(selectLectureByCourseID, userListenCourse[i]);

        for(var j=0;j<allLectureDataByCourseID.length;j++){
            allLecture.push(allLectureDataByCourseID[j].lecture_id);
        }
    }

    for(var i=0;i<userListenLecture.length;i++){


        userUnListenedLecture = array_diff(allLecture, userListenLecture);


        // userUnListenedLecture.splice(userListenLecture.indexOf(userListenLecture[i]), 1);
    }
    console.log(userUnListenedLecture);


    let insertHistoryLectureId =
    `
        INSERT INTO user_history (user_id, lecture_id, watched_flag) VALUES (?, ?, 0);
    `;



    let selectUserHistoryByLectureId = 
    `
        SELECT lecture_id FROM user_history WHERE lecture_id = ?
    `
    
    console.log(userUnListenedLecture);
    console.log(userUnListenedLecture[i]);
    for(var i=0;i<userUnListenedLecture.length;i++){
        let checkDuplicate = await db.queryParamCnt_Arr(selectUserHistoryByLectureId, userUnListenedLecture[i]);
        // if(checkDuplicate[i].lecture_id == 0){
        //     await db.queryParamCnt_Arr(insertHistoryLectureId, userUnListenedLecture[i].lecture_id)
        // }
    }
    // let confirm = await db.queryParamCnt_Arr(selectUserHistoryByLectureId, userListenCourse[i]);

    // console.log("confirm value ==>  " + confirm[0].lecture_id);



    // if(confirm[])

    // console.log(userUnListenedLecture);
    if(userUnListenedLecture.length != 0)
    for(var i=0;i<userUnListenedLecture.length;i++){
        await db.queryParamCnt_Arr(insertHistoryLectureId, [userID, userUnListenedLecture[i]]);
    }


    // console.log(userUnListenedLecture);



    // if(userListenCourse.indexOf(data[i].course_id) == -1){
    //     userListenCourse.push(data[i].course_id);
    // }



    // Res : Course List
    // User가 듣고 있는 모든 강좌 출력
    let allCourseList = await sql.getCourseByUserID(userID);
    
    for(var i=0; i < allCourseList.length; i++){
        listOfCourse.push(allCourseList[i].course_id);
    }


    // console.log()
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
        "msg" : "Error /users/main/progressLecture "
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
    console.log("===main.js ::: router('/greeting')===");
    const chkToken = jwt.verify(req.headers.authorization);
    // 토큰 검증 실패
    if(chkToken == -1) {
        res.status(401).send({
            message : "Access Denied"
        });
    }

    let email = chkToken.email;
    let result = {};


    var selectQuery = 
    `
    select thumbnail_path, nickname
    from user
    where id = ? ;
    `
    var userImg = await db.queryParamCnt_Arr(selectQuery,email);

    var now = moment().format('YYYY-MM-DD');
    var lastAccessTime = moment("2018-01-07")
    var accessFromNow = moment(lastAccessTime).startOf('day').fromNow(); // intvalue_accessFromNow + " days ago" 형식올 출력된다.
    var intvalue_accessFromNow = accessFromNow.substring(0,1) - 1;



    let mentArr = [];

    if(userImg != undefined && userImg.length != 0){
        let ment1 = '님 [Rhino] 반지 모델링하기 3강 질문에 대한 답변이 도착했습니다.'; 
        let ment2 = '님 3일 연속 출석이네요!';
        let ment3 = '님 [Rhino] 반지 모델링하기 완강까지 진도율 70% 달성했습니다! ';
        let ment4 = '님 ' + intvalue_accessFromNow + '일만에 출석이네요! 조금 더 자주 뵀으면 좋겠어요 ^^';
        let ment5 = '님 토요일이네요~ 즐거운          주말의 시작 컴만과 함께해요!^^';


        mentArr.push(ment1);
        mentArr.push(ment2);
        mentArr.push(ment3);
        mentArr.push(ment4);
        mentArr.push(ment5);
    }
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
