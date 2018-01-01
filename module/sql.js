const async = require('async');
const moment = require('moment');

const pool = require('../../config/dbPool.js');
const db = require('./pool.js');



module.exports = {
  // User ID로 수강중인 강좌 찾기
  // writtend by 신기용
  getCourseByUserID : async (...args) =>{
    const data = args[0]; // User ID
    let selectQuery =`
    select distinct a.course_id 
    from all_user_info as a, user_history as u 
    where u.user_id = ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // Lecture ID로 소속된 Course 찾기
  // writtend by 신기용
  getCourseByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select distinct a.course_id 
    from all_user_info as a, user_history as u 
    where u.lecture_id = ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // Lecture ID로 소속된 Chapter 찾기
  // writtend by 신기용
  getChapterByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    select distinct a.chapter_id 
    from all_user_info as a, user_history as u 
    where u.lecture_id = ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // Course가 갖고 있는 Lecture Total Cnt
  // writtend by 신기용
  getTotalLectureCntInCourse : async (...args) =>{
    const data = args[0]; // course ID
    let selectQuery =`
    SELECT count(*) as cnt 
    FROM comman.all_course_info 
    where course_id=?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // User가 특정 Course에서 몇 개의 Lecture를 듣는지 찾기
  // writtend by 신기용
  getLectureCntOfUserInCourse : async (...args) => {
    const data = []; 
    data.push(args[0]); // user ID

    let selectQuery_1 = `
    select distinct a.course_id
    from all_user_info as a, user_history as u
    where u.user_id = ?
    `
    let course_id = await db.queryParamCnt_Arr(selectQuery_1,args[0]);
    data.push(course_id[0].course_id);

    let selectQuery_2 = `
    select count(*) as count
    from all_user_info 
    where user_id=? and course_id=?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery_2,[1,1]);
    return result;
  },

  // User ID로 수강중인 Course 찾기 
  // writtend by 신기용
  getCourseInProgressByUserID : async (...args) => {
    const data = args[0];// user ID
    let selectQuery = `
    select distinct a.course_id
    from all_user_info as a, user_history as u
    where u.user_id = ?
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },
  
  // Course에서 User가 수강했거나, 수강 중인 Lecture의 Count
  // writtend by 탁형민
  getCourseInProgressByUserIDandCourseID : async (...args) =>{
    const data = args[0]; // userID and courseID
    let selectQuery =`
    SELECT count(*) as cnt
    FROM all_user_info 
    WHERE flag = 1 or flag = 2 and user_id = ? and course_id = ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },

  // Lecture ID로 Chapter title 뽑기
  // writtend by 탁형민
  getChapterTitleByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    SELECT B.title  
    FROM comman.all_user_info A join chapter B 
    WHERE A.chapter_id = B.id and lecture_id= ?;

    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
  },


  // Lecture ID로 Course title 뽑기
  // writtend by 탁형민
  getCourseTitleByLectureID : async (...args) =>{
    const data = args[0]; // lecture ID
    let selectQuery =`
    SELECT B.title 
    FROM comman.all_user_info A join course B 
    WHERE A.course_id = B.id and lecture_id= ?;
    `
    let result = await db.queryParamCnt_Arr(selectQuery,data);
    return result;
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
