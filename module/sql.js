const async = require('async');
const moment = require('moment');
const db = require('./pool.js');



module.exports = {

  /*
  Req : {userID}
  Res : Course List
  Dec : Finding the course you are taking with user ID
        User ID로 소속된 Course List 찾기
  writtend by 신기용
  */
  getCourseByUserID : async (...args) =>{
    const data = args[0]; // User ID
    let selectQuery =`
    select distinct aui.course_id 
    from all_user_info as aui, user_history as uh
    where uh.user_id = aui.user_id
    and uh.user_id = ?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },


  
  /*
  Req : {courseID}
  Res : Lecture [ ID,title ] List
  Dec : List of lectures belonging to Chapters
        Chapter에 속한 Lectures List
  writtend by 신기용
  */
  getLectureListBelong2Chapter : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select l.id as l_id, l.title as l_title
    from chapter as ch, lecture as l
    where ch.id = l.chapter_id
    and l.chapter_id = ?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },


  /*
  Req : {lecutreID}
  Res : Chapter [ ID, title ]
  Dec : Find a Chapter with a lecture ID
        Lecture ID로 소속된 Chapter 찾기
  writtend by 신기용
  */
  getChapterUsingLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select ch.id as ch_id, ch.title as ch_title
    from chapter as ch, lecture as l
    where ch.id = l.chapter_id
    and l.id = ?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  /*
  Req : Course ID 
  Res : Number of lectures belonging to Course
  Dec : Course가 갖고 있는 Lecture Total Cnt
  writtend by 신기용
  */
  getTotalLectureCntInCourse : async (...args) =>{
    const data = args[0]; // course ID
    let selectQuery =`
    SELECT count(*) as cnt 
    FROM all_course_info 
    where course_id=?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  /*
  Req : {chapterID}
  Res : Number of lectures belonging to Chapter
  Dec : Chapter가 갖고 있는 Lecture Total Cnt
  writtend by 신기용
  */
  getTotalLectureCntInChapter : async (...args) =>{
    const data = args[0]; // chapter ID
    let selectQuery =`

    SELECT aci.lecture_id
    FROM all_course_info as aci 
    where aci.chapter_id=?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },


  
  

  /*
  Req : User ID 
  Res : Lecture Cnt
  Dec : Check how many lectures the user is listening to in the course
        User가 특정 Course에서 몇 개의 Lecture를 듣는지 찾기
  writtend by 신기용
  */
  getLectureCntOfUserInCourse : async (...args) => {
    const data = []; 
    data.push(args[0]); // user ID

    let selectQuery_1 = `
    select distinct a.course_id
    from all_user_info as a, user_history as u
    where u.user_id = ?
    `;
    let course_id = await db.queryParamCnt_Arr(selectQuery_1,args[0]);
    data.push(course_id[0].course_id);

    let selectQuery_2 = `
    select count(*) as count
    from all_user_info 
    where user_id=? and course_id=?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery_2,[1,1]);
    return result;
  },

 
  
  // Course에서 User가 수강했거나, 수강 중인 Lecture의 Count
  // writtend by 탁형민
  getCourseInProgressByUserIDandCourseID : async (...args) =>{
    const data = args[0]; // userID and courseID
    let selectQuery =`
    select count(*) as cnt
    from user_history as uh, all_user_info as aui
    where aui.user_id = uh.user_id
    and aui.lecture_id = uh.lecture_id
    and uh.user_id = ?
    and aui.course_id = ?
    and ( uh.watched_flag = 1 or uh.watched_flag = 2 );
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // Lecture ID로 Chapter title 뽑기
  // writtend by 탁형민
  getChapterTitleByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select ch.title
    from all_course_info as aci, chapter as ch
    where aci.lecture_id = ? and aci.chapter_id = ch.id ;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result[0].title;
  },


  // Lecture ID로 Course title 뽑기
  // writtend by 탁형민
  getCourseTitleByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    SELECT distinct B.title
    FROM all_user_info A join course B 
    WHERE A.course_id = B.id and lecture_id= ?;
    `;
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result[0].title;
  },

  
  /*
  Req : Course ID 
  Res : Belonging Chapter List
  Dec : Each ( Title, Number of lectures included )
  writtend by 신기용
  */
  getCourseInfoByCourseID : async (...args) =>{
    const data = args[0]; // course ID
    let result = [];
  
    var selectQuery =`
    select distinct aui.chapter_id
    from all_user_info as aui
    where aui.course_id = ?;
    `;

    let chapterCnt = await db.queryParamCnt_Arr(selectQuery,data);

    for(var i=0; i<chapterCnt.length; i++){
      let object = {};
  
      selectQuery =`
      select title
      from chapter as ch
      where ch.id = ?;
      `;
      let chapterTitle = await db.queryParamCnt_Arr(selectQuery,chapterCnt[i].chapter_id);

      selectQuery =`
      select count(*) as cnt
      from lecture as l
      where l.chapter_id = ?;
      `;
      let lectureCnt = await db.queryParamCnt_Arr(selectQuery,chapterCnt[i].chapter_id);


      selectQuery =`
      select c.opened_chapter
      from course as c
      where c.id = ?;
      `;

      let openedChapterCnt = await db.queryParamCnt_Arr(selectQuery,chapterCnt[i].chapter_id);

      object.chapterID = chapterCnt[i].chapter_id;
      object.openedChapterCnt = openedChapterCnt[0].opened_chapter;
      object.chapterOrder = i+1 + "장";
      object.chapterTitle = chapterTitle[0].title;
      object.lectureCnt = lectureCnt[0].cnt;

      result.push(object);
    }
    return result;
  },

  /*
  Req : Course ID 
  Res : Course Info
  Dec : Teacher Profile, Teacher Name, Course Title, Each Chapter Info
  writtend by 신기용
  */
  getExplainPopUpByCourseID : async (...args) =>{
    const data = args[0]; // course ID
    let result = {};
  
    var selectQuery =`
    select c.title, s.thumbnail_path as img, s.name
    from course as c, supplier as s
    where c.supplier_id = s.id
    and c.id = ?;
    `;


    let courseInfoObj = {};
    let courseInfo = await db.queryParamCnt_Arr(selectQuery,data);
    if( courseInfo.length == 1){
      courseInfoObj.title = courseInfo[0].title;
      courseInfoObj.img = courseInfo[0].img;
      courseInfoObj.name = courseInfo[0].name;
    }
    result.courseInfo = courseInfoObj;

    selectQuery =`
    select ch.title, ch.info
    from chapter as ch
    where ch.course_id = ?
    order by priority;
    `;
    
    let chapterInfoArr = [];
    let chapterInfo = await db.queryParamCnt_Arr(selectQuery,data);
    for(var i=0; i<chapterInfo.length; i++){
      let tmpChapterInfoObj = {};
      tmpChapterInfoObj.title = i+1 + "장. " + chapterInfo[i].title;
      tmpChapterInfoObj.info = chapterInfo[i].info;
      chapterInfoArr.push(tmpChapterInfoObj);
    }

    result.chapterInfo = chapterInfoArr;
    
    return result;
  },



  /*
  Req : {lecutreID}
  Res : Quiz Cnt Belonging to Lecutre
  Dec : Number of quizzes belonging to the lecture
        각 강의에 속해있는 퀴즈 Count
  writtend by 신기용
  */
  getQuizCntBelong2Lecture : async (...args) =>{
    const data = args[0]; // lecture ID
    var selectQuery =`
    select count(*) as cnt
    from lecture as l, quiz_title as qt, quiz_question as qq
    where l.id = qt.lecture_id
    and qt.id = qq.quiz_id
    and l.id = ?;
    `;

    let quizCnt = await db.queryParamCnt_Arr(selectQuery,data);    
    return quizCnt[0].cnt;
  },



  // 나중에 비슷한 View 생성or수정시 쿼리문 수정
  createAllCourseInfoViewQuery : async (...args) =>{
    let createQuery = `
    create view comman_db.all_course_info
    as select c.id as course_id, ch.id as chapter_id, l.id as lecture_id
    from course as c, chapter as ch, lecture as l
    where
    l.chapter_id = ch.id
    and ch.course_id = c.id;
    `
  },

    makeNewChatRoomTable : async (...args) => {
    const name = args[0];
    var ctrl_name = name + '_' + moment().format('YYMMDDHHmmss');
    console.log(ctrl_name);
    let createAllTableQuery =
    `
    CREATE TABLE IF NOT EXISTS chat.` + ctrl_name + ` (
      chat_idx INT(11) NOT NULL AUTO_INCREMENT,
      content TEXT NULL DEFAULT NULL,
      write_time VARCHAR(45) NULL DEFAULT NULL,
      count INT(11) NULL DEFAULT NULL,
      u_idx INT(11) NULL DEFAULT NULL,
      user_photo TEXT NULL DEFAULT NULL,
      PRIMARY KEY (chat_idx))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;
    `;

    let checkAllTable = await db.queryParamCnt_0(createAllTableQuery);
    console.log("checkAllTable", checkAllTable);
    let insertGroupQuery = 'INSERT INTO chat.group (real_name, ctrl_name) VALUES (?,?)';
    let insertGroup = await db.queryParamCnt_Arr(insertGroupQuery, [name, ctrl_name]);
    console.log("insertGroup", insertGroup);

    //let insertJoinedQuery = 'INSERT INTO admin.joined (u_idx, g_idx) VALUES (?,?)';
    //let insertJoined = await db.queryParamCnt_Arr(insertJoinedQuery, [])
  },
  
  joinNewPerson : async (...args) => {
    const name = args[0];
    const user_name = args[1];
    let searchAllInfoQuery = 'SELECT * FROM A.user WHERE name = ?';
    let searchAllInfo = await db.queryParamCnt_Arr(searchAllInfoQuery, [user_name]);

    let insertUserInfoQuery = 'INSERT INTO C.`' + name + '` (idx, name, bio, photo) VALUES (?,?,?,?)';
    let object = [searchAllInfo.idx, searchAllInfo.name, searchAllInfo.bio, searchAllInfo.photo];
    let insertUserInfo = await db.queryParamCnt_Arr(insertUserInfoQuery, object);
  },
  findUserIndex : async (...args) => {
    let user_name = args[0];
    let searchUserIdxQuery = 'SELECT idx FROM A.user WHERE name = ?';
    let result = await db.queryParamCnt_Arr(searchUserIdxQuery, [user_name]);
    return result.user_idx;
  },
  findRestResLights : async (...args) => {
    let user_idx = args[0];
    let findUserJoinedQuery = 'SELECT * FROM A.joined WHERE user_idx = ?';
    let tables = await db.queryParamCnt_Arr(findUserJoinedQuery, [user_idx]);
    if(result.length === 0) {
      res.status(400).send({
        message : "wrong input"
      });
    } else {
      for(let i = 0 ; i < result.length ; i++) {
        let findSpecificQuery = 'SELECT * FROM ';
      }
    }
  }
};
